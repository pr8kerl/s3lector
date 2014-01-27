//Buckets service used for buckets REST endpoint
angular.module('mean.buckets').factory("Buckets", ['$resource', function($resource) {
    return $resource('buckets/:bucketId', {
        bucketId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        fill: {
            method: 'GET',
						url: 'buckets/:bucketId/fill'
        }
    });
}]);
