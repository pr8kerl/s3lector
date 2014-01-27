/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * LogEvent Schema
        default: function(){ d = new Date(); return d.toUTCString(); }
 */
var LogEventSchema = new Schema({
    msg: {
        type: String,
        default: '',
        trim: true
    },
    time: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: String,
        default: ''
    }
});

/**
 * Validations
 */
LogEventSchema.path('user').validate(function(user) {
    return user.length;
}, 'logEvent user cannot be blank');

/**
 * Statics
 */
LogEventSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('LogEvent', LogEventSchema);
