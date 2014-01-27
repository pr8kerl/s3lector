/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * S3Object Schema
 */
var S3ObjectSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    uri: {
        type: String,
        default: '',
        trim: true
    },
    md5sum: {
        type: String,
        default: '',
        trim: true
    },
    size: {
        type: Number,
        default: 0,
        trim: true
    },
    sizeFriendly: {
        type: String,
        default: '0 Bytes',
        trim: true
    },
    access: {
        type: String,
        default: 'public',
        trim: true
    },
    mtime: {
        type: Date,
        default: Date.now,
        trim: true
    },
    bucket: {
        type: Schema.ObjectId,
        ref: 'Bucket'
    }
});

/**
 * Validations
 */
S3ObjectSchema.path('name').validate(function(name) {
    return name.length;
}, 'S3 object name cannot be blank');

/**
 * Statics
 */
S3ObjectSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('bucket', 'name').exec(cb);
};
S3ObjectSchema.statics.dropByBucket = function(bid, cb) {
		var oid = mongoose.Types.ObjectId(bid.toHexString());
    this.find({
        bucket: oid
    }).remove().exec(cb);
};

mongoose.model('S3Object', S3ObjectSchema);
