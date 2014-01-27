//Buckets service used for buckets REST endpoint 
angular.module('mean.s3objects').factory("S3Objects", ['$resource', function($resource) {
    return $resource('objects/:objectId', {
        objectId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
