/**
 * Module dependencies.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    fs = require('fs'),
    config = require('../config/config'),
    mongoose = require('mongoose');

//Bootstrap db connection
var db = mongoose.connect(config.db);
mongoose.connection.on('error', function callback () { console.log("connection error") });
mongoose.connection.once('open', function callback () {
  // yay!
  console.log("successful mongoose connection");
});

//Bootstrap models
var models_path = __dirname + '/../app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }   
        } else if (stat.isDirectory()) {
            walk(newPath);
        }   
    }); 
};
walk(models_path);

var Bucket = mongoose.model('Bucket'),
    S3Object = mongoose.model('S3Object'),
    AWS = require('aws-sdk'),
    _ = require('lodash');

/**
 * List and fill Buckets
 */
function getAndFillBuckets() {
    Bucket.find().sort('-name').populate('user', 'name username').exec(function(err, buckets) {
        if (err) {
					console.log("could not retrieve buckets: %s", err);
					return err;
        } else {
					// for each bucket - drop contents and fill it
          buckets.forEach( function(buck) {
    					fillBucket(buck,err);
      				if (err) {
            		console.log('bucket fill error: %s',err);
      				};  
					});
        }
    });
}


function S3File(s3resp,bucket) {
  var bits = s3resp.Key.split('/');
  this.name = bits[bits.length-1];
//  this.description = '';
  this.uri = s3resp.Key; 
  this.md5sum = s3resp.ETag.replace(/\"/g,'');
  this.size = s3resp.Size;
  this.sizeFriendly = bytesToSize(s3resp.Size);
  this.access = bucket.access;
  this.mtime = new Date(s3resp.LastModified);
	this.bucket = bucket._id;
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}


function fillBucket(bkt,err) {
	var bucket = bkt;
   console.log('fill bucket: %s',bucket.name);
	// Set your region for future requests.
	AWS.config.update({ accessKeyId: bucket.accessKeyId, secretAccessKey: bucket.secretAccessKey, region: bucket.region, sslEnabled:true });
	var s3 = new AWS.S3();
  var params = { Bucket: bucket.name };
  if (bucket.prefix) {
    params.Prefix = bucket.prefix;
  }
	s3.client.listObjects(params, function(err,resp) {
		/*jshint loopfunc: true */
		if (err) {
			console.log('listObjects error: %s',err);
			return err;
		}
		else {

      // we have a valid response - kill current objects for this bucket
      console.log('fill dropping objects for bucket: %s',bucket.name);
      S3Object.dropByBucket(bucket._id, function(err, bucket) {
        if (err) {
//            util.log(req.user, "DEL ERR deleting objects of bucket " + bucket.name + " failed: " + err);
            console.log("DEL ERR deleting objects of bucket " + bucket.name + " failed: " + err);
					return err;
				}
      }); 

			// pick only what we need out of the response
			var m = 0;
			var n = resp.Contents.length;
			var files = [];

			for (var i = 0; i < n; i++) {
				// the S3 file is not a directory
				if (resp.Contents[i].Size) {
					files[m] = new S3File(resp.Contents[i],bucket);
					var s3obj = new S3Object(files[m]);
//					console.log('object: %s',s3obj);
					s3obj.save(function(err) {
						if (err) {
							console.log('s3obj save error: %s',err);
						} 
					}); 
					m++;
				}
			}
      var bdate = new Date();
			bucket.numObjects = m;
			bucket.lastImport = bdate;
			bucket.save(function(err) {
			if (err) {
						console.log("FILL ERR bucket save error " + bucket.name + ": %s",err);
      }
			}); 
      console.log("FILL OK bucket " + bucket.name + " filled");
//      util.log(req.user, "FILL OK bucket " + bucket.name + " filled");
		}
	});
}

getAndFillBuckets();


