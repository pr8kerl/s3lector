/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    LogEvent = mongoose.model('LogEvent'),
    LogEvent = mongoose.model('LogEvent'),
    S3Object = mongoose.model('S3Object'),
    _ = require('lodash');


/**
 * Find logevent by id
 */
exports.logevent = function(req, res, next, id) {
    LogEvent.load(id, function(err, logevent) {
        if (err) return next(err);
        if (!logevent) return next(new Error('Failed to load logevent ' + id));
        req.logevent = logevent;
        next();
    });
};

/**
 * Create a logevent
 */
exports.create = function(req, res) {
    var logevent = new LogEvent(req.body);
    logevent.user = req.user;

    logevent.save(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
								message: 'could not save logevent',
								error: err
            });
        } else {
            res.jsonp(logevent);
        }
    });
};

/**
 * Update a logevent
 */
exports.update = function(req, res) {
    var logevent = req.logevent;

    logevent = _.extend(logevent, req.body);

    logevent.save(function(err) {
        res.jsonp(logevent);
    });
};

/**
 * Delete an logevent
 */
exports.destroy = function(req, res) {
    var logevent = req.logevent;

    logevent.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
								message: 'could not delete logevent: ' + logevent.name,
								error: err
            });
        } else {
            res.jsonp(logevent);
        }
    });
};

/**
 * log utility
 */
exports.log = function(luser, lmsg) {
    var logevent = new LogEvent();
    logevent.user = luser;
    logevent.msg = lmsg;

    logevent.save(function(err) {
        if (err) {
						console.log("could not save new logevent: %s",lmsg);
        }
    });
};


/**
 * Show a logevent
 */
exports.show = function(req, res) {
    res.jsonp(req.logevent);
};

/**
 * List of LogEvents
 */
exports.all = function(req, res) {
    LogEvent.find().sort('-time').exec(function(err, logevents) {
        if (err) {
            res.render('error', {
                status: 500,
								message: 'could not retrieve logevents',
								error: err
            });
        } else {
            res.jsonp(logevents);
        }
    });
};

