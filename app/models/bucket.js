/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Bucket Schema
 */
var BucketSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    accessKeyId: {
        type: String,
        default: '',
        trim: true
    },
    secretAccessKey: {
        type: String,
        default: '',
        trim: true
    },
    region: {
        type: String,
        default: 'ap-southeast-2',
        trim: true
    },
    prefix: {
        type: String,
        default: '',
        trim: true
    },
    access: {
        type: String,
        default: 'public',
        trim: true
    },  
    numObjects: {
        type: Number,
        default: 0
    },
    lastImport: {
        type: Date
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
BucketSchema.path('name').validate(function(name) {
    return name.length;
}, 'bucket name cannot be blank');

/**
 * Statics
 */
BucketSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Bucket', BucketSchema);
