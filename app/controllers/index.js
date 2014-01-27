/**
 * Module dependencies.
var s3objects = require('./s3objects');
 */
var mongoose = require('mongoose');


exports.render = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};
