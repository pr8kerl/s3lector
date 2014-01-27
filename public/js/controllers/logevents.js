angular.module('mean.logevents').controller('LogEventsController', ['$scope', '$routeParams', '$location', 'Global', 'LogEvents', function ($scope, $routeParams, $location, Global, LogEvents) {
    $scope.global = Global;

		$scope.orderProp = '-mtime';

    $scope.find = function() {
        LogEvents.query(function(logevents) {
            $scope.logevents = logevents;
        });
    };

}]);
