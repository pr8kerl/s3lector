/**
 * Managed User Module dependencies.
 */
var mongoose = require('mongoose'),
    Muser = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create user
 */
exports.create = function(req, res) {
    var muser = new Muser(req.body);
    var message = null;

    muser.provider = 'local';
    muser.save(function(err) {
        if (err) {
            switch(err.code){
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default: 
                    message = 'Please fill all the required fields';
            }

            return res.render('500', {
                status: 500,
                message: 'could not save managed user',
                error: err
            });
        }
        res.jsonp(muser);
		});
};

/**
 * Find user by id
 */
exports.muser = function(req, res, next, id) {
		Muser.load(id, function(err, muser) {
			if (err) return next(err);
			if (!muser) return next(new Error('Failed to load managed user ' + id));
			req.muser = muser;
			next();
		});
};


/**
* Show a managed user
*/
exports.show = function(req, res) {
	res.jsonp(req.muser);
};

/**
 * Update a managed user
 */
exports.update = function(req, res) {
    var muser = req.muser;

    muser = _.extend(muser, req.body);

    muser.save(function(err) {
        res.jsonp(muser);
    });
};

/**
 * Delete a managed user
 */
exports.destroy = function(req, res) {
    var muser = req.muser;

    muser.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500,
                message: 'could not remove managed user',
                error: err
            });
        } else {
            res.jsonp(muser);
        }
    });
};



/**
 * List of users
 */
exports.all = function(req, res) {
    Muser.find().sort('email').exec(function(err, musers) {
        if (err) {
            res.render('error', {
                status: 500 
            }); 
        } else {
            res.jsonp(musers);
        }   
    }); 
};

