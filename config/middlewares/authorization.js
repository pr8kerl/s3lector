/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin')
};
/**
 * Generic admin auth middleware - if a user is local - they are admin
exports.isAdmin = function(req, res, next) {
		if (!req.profile.admin) {
            return res.send(401, 'user is not an admin');
    }
    next();
};
 */

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'user is not authorized');
        }
        next();
    },
    isAdmin: function(req, res, next) {
        if (req.user.admin === false) {
            return res.send(401, 'user is not authorized');
        }
        next();
    }
};


/**
 * Bucket authorizations routing middleware
 */
exports.bucket = {
    hasAuthorization: function(req, res, next) {
        if (req.bucket.user.id != req.user.id) {
            return res.send(401, 'user is not authorized');
        }
        next();
    }
};

/**
 * S3Object authorizations routing middleware
 */
exports.s3object = {
    hasAuthorization: function(req, res, next) {
// dummy for now
//        if (req.bucket.user.id != req.user.id) {
//            return res.send(401, 'user is not authorized');
//        }
        next();
    }
};
