
var databasename = process.env.OPENSHIFT_APP_NAME || "s3lector";
var mongodburl = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost/";
mongodburl = mongodburl + databasename;

module.exports = {
    debug: "false",
    dbname: databasename,
    db: mongodburl,
    address: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
    app: {
        name: databasename
    },
    yammer: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/yammer/callback"
    },
    twitter: {
        clientID: "CONSUMER_KEY",
        clientSecret: "CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}
