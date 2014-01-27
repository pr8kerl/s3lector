module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Setting the yammer oauth routes
    app.get('/auth/yammer', passport.authenticate('yammer', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/yammer/callback', passport.authenticate('yammer', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Managed user Routes
    var musers = require('../app/controllers/musers');
    app.get('/musers', auth.requiresLogin, auth.user.isAdmin, musers.all);
    app.post('/musers', auth.requiresLogin, auth.user.isAdmin, musers.create);
    app.get('/musers/:muserId', auth.requiresLogin, auth.user.isAdmin, musers.show);
    app.put('/musers/:muserId', auth.requiresLogin, auth.user.isAdmin, musers.update);
    app.del('/musers/:muserId', auth.requiresLogin, auth.user.isAdmin, musers.destroy);
    app.param('muserId', musers.muser);


    //Bucket Routes
    var buckets = require('../app/controllers/buckets');
    app.get('/buckets', auth.requiresLogin, auth.user.isAdmin, buckets.all);
    app.post('/buckets', auth.requiresLogin, auth.user.isAdmin, buckets.create);
    app.get('/buckets/:bucketId', auth.requiresLogin, auth.user.isAdmin, auth.bucket.hasAuthorization, buckets.show);
    app.put('/buckets/:bucketId', auth.requiresLogin, auth.user.isAdmin, auth.bucket.hasAuthorization, buckets.update);
    app.del('/buckets/:bucketId', auth.requiresLogin, auth.user.isAdmin, auth.bucket.hasAuthorization, buckets.destroy);
    app.get('/buckets/:bucketId/fill', auth.requiresLogin, auth.user.isAdmin, buckets.fill);


    //Object Routes
    var s3objects = require('../app/controllers/s3objects');
    app.get('/objects', auth.requiresLogin, s3objects.all);
    app.get('/objects/:objectId/:bucketId', auth.requiresLogin, auth.s3object.hasAuthorization, s3objects.getObject);
//    app.put('/objects/:objectId', auth.requiresLogin, auth.s3object.hasAuthorization, s3objects.updateObject);
//    app.del('/objects/:objectId', auth.requiresLogin, auth.s3object.hasAuthorization, s3objects.destroyObject);

    var logevents = require('../app/controllers/logevents');
    app.get('/logs', auth.requiresLogin, auth.user.isAdmin, logevents.all);

    //Finish with setting up the params
    app.param('bucketId', buckets.bucket);
    app.param('objectId', s3objects.s3object);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', auth.requiresLogin, index.render);

};
