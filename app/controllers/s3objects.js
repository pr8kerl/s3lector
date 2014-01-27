/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    S3Object = mongoose.model('S3Object'),
		Bucket = mongoose.model('Bucket'),
		util = require('./util'),
    AWS = require('aws-sdk'),
    _ = require('lodash');


/**
 * Find s3object by id
 */
exports.s3object = function(req, res, next, id) {
    S3Object.load(id, function(err, s3object) {
        if (err) return next(err);
        if (!s3object) return next(new Error('Failed to load s3object ' + id));
        req.s3object = s3object;
        next();
    });
};

/**
 * Create a s3object
 */
exports.create = function(req, res) {
    var s3object = new S3Object(req.body);
    s3object.user = req.user;

    s3object.save(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
                message: 'could not save s3object',
								error: err
            });
        } 
        res.jsonp(s3object);
    });
};

/**
 * Update a s3object
 */
exports.update = function(req, res) {
    var s3object = req.s3object;

    s3object = _.extend(s3object, req.body);

    s3object.save(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
                message: 'could not save s3object',
                error: err
            });
        }
        res.jsonp(s3object);
    });
};

/**
 * Delete an s3object
 */
exports.destroy = function(req, res) {
    var s3object = req.s3object;

    s3object.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
                message: 'could not remove s3object',
								error: err
            });
        } else {
            res.jsonp(s3object);
        }
    });
};

/**
 * Show a s3object
 */
exports.show = function(req, res) {
    res.jsonp(req.s3object);
};

/**
 * List of S3Objects
 */
exports.all = function(req, res) {
    var accessgroups = [ 'public' ];
    if (req.user.access === 'private' || req.user.admin ) {
      accessgroups = [ 'public',  'private' ];
      console.log("setting s3objects accessgroups to public and private");
    }
    S3Object.find( { access: { $in: accessgroups } } ).sort('-mtime').populate('bucket', 'name').exec(function(err, s3objects) {
        if (err) {
            res.render('error', {
                status: 500,
                message: 'could not get s3objects',
								error: err
            });
        } else {
            res.jsonp(s3objects);
        }
    });
};



/**
 * getObject - return a signed S3 object url
 */
exports.getObject = function(req, res) {
  var s3object = req.s3object;
  var bucket = req.bucket;
	console.log('getObject s3object.bucket._id: %s',s3object.bucket._id);
	console.log('getObject bucket._id: %s',bucket._id);

  AWS.config.update({ accessKeyId: bucket.accessKeyId, secretAccessKey: bucket.secretAccessKey, region: bucket.region, sslEnabled:true }); 
  var s3 = new AWS.S3();
  var params = { Bucket: s3object.bucket.name, Key: s3object.uri, Expires: 60 };

	s3.getSignedUrl('getObject', params, function(err,s3url) {
		if (err) {
			console.log('getSignedUrl error: %s',err);
			res.render('error', {
								status: 500,
								message: 'could not get aws s3 signed url',
								error: err,
			}); 
			util.log(req.user, "GET ERR " + s3object.bucket.name + "://" + s3object.uri + " " + err);
    }   
    else {
			console.log('getSignedUrl successful: %s', s3url); // expires in 60 seconds
			res.set('Black Jelly Beans','yummy!');
			res.attachment();
			res.redirect(302,s3url);
			util.log(req.user, "GET OK " + s3object.bucket.name + "://" + s3object.uri);
    }
	});
};


