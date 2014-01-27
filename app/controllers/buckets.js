/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Bucket = mongoose.model('Bucket'),
    S3Object = mongoose.model('S3Object'),
    util = require('./util'),
    AWS = require('aws-sdk'),
    _ = require('lodash');


/**
 * Find bucket by id
 */
exports.bucket = function(req, res, next, id) {
    Bucket.load(id, function(err, bucket) {
        if (err) return next(err);
        if (!bucket) return next(new Error('Failed to load bucket ' + id));
        req.bucket = bucket;
        next();
    });
};

/**
 * Create a bucket
 */
exports.create = function(req, res) {
    var bucket = new Bucket(req.body);
    bucket.user = req.user;

    console.log(bucket);
    bucket.save(function(err) {
        if (err) {
            util.log(req.user, "PUT ERR bucket " + bucket.name + " create failed " + err);
            return res.send('users/signup', {
                errors: err.errors,
                bucket: bucket
            });
        } else {
            res.jsonp(bucket);
            util.log(req.user, "PUT OK bucket " + bucket.name + " created");
        }
    });
};

/**
 * Update a bucket
 */
exports.update = function(req, res) {
    var bucket = req.bucket;

    bucket = _.extend(bucket, req.body);

    bucket.save(function(err) {
        res.jsonp(bucket);
        util.log(req.user, "UPDATE OK bucket " + bucket.name + " updated");
    });
};

/**
 * Delete an bucket
 */
exports.destroy = function(req, res) {
    var bucket = req.bucket;

		// remove objects belonging to this bucket
    console.log('attempting to drop objects for bucket id: %s',bucket._id);
    S3Object.dropByBucket(bucket._id, function(err, bucket) {
        if (err) {
            util.log(req.user, "DEL ERR deleting objects of bucket " + bucket.name + " failed: " + err);
            res.render('error', {
                status: 500,
								message: 'could not drop bucket objects: ' + bucket.name,
								error: err
            });
				}
    }); 

    bucket.remove(function(err) {
        if (err) {
            util.log(req.user, "DEL ERR bucket " + bucket.name + " delete failed " + err);
            res.render('error', {
                status: 500,
								message: 'could not delete bucket: ' + bucket.name,
								error: err
            });
        } else {
            res.jsonp(bucket);
            util.log(req.user, "DEL OK bucket " + bucket.name + " deleted");
        }
    });
};

/**
 * Show a bucket
 */
exports.show = function(req, res) {
    res.jsonp(req.bucket);
};

/**
 * List of Buckets
 */
exports.all = function(req, res) {
    Bucket.find().sort('-name').populate('user', 'name username').exec(function(err, buckets) {
        if (err) {
            res.render('error', {
                status: 500,
								message: 'could not retrieve buckets',
								error: err
            });
        } else {
            res.jsonp(buckets);
        }
    });
};

//function saveCallBack(err,response,s3object) {
//						if (err) {
//							console.log(err);
//							response.render('error', {
//								status: 500,
//								message: 'could not save object: ' + s3object.name,
//								error: err
//							});
//						} 
//						else {
//							response.jsonp(s3object);
//						}
//
//}

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


exports.fill = function(req, res) {
	var bucket = req.bucket;
   console.log('fill bucket: %s',bucket);
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
			res.jsonp(err);
		}
		else {
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
							res.render('error', {
								status: 500,
								message: 'could not save object: ' + err,
								error: err
							});
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
						console.log('bucket save error: %s',err);
						res.render('error', {
							status: 500,
							message: 'could not save bucket: ' + err,
							error: err
						});
					} 
			}); 
			res.jsonp(bucket);
      util.log(req.user, "FILL OK bucket " + bucket.name + " filled");
		}
	});
};
