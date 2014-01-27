//Managed Users service used for musers REST endpoint
angular.module('mean.musers').factory("Users", ['$resource', function($resource) {
    return $resource('musers/:muserId', {
        muserId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
