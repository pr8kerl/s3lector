angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
			{
        "title": "buckets",
        "link": "buckets"
			}, 
			{
        "title": "users",
        "link": "musers"
			},
			{
        "title": "logs",
        "link": "logs"
			}
		];

    $scope.isCollapsed = false;
}]);
