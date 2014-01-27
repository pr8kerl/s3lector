//Buckets service used for buckets REST endpoint
angular.module('mean.logevents').factory("LogEvents", ['$resource', function($resource) {
    return $resource('logs/:logId', {
        logId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
