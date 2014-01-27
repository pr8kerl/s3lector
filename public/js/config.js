//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/buckets', {
            templateUrl: 'views/buckets/list.html'
        }).
        when('/buckets/create', {
            templateUrl: 'views/buckets/create.html'
        }).
        when('/buckets/:bucketId/edit', {
            templateUrl: 'views/buckets/edit.html'
        }).
        when('/buckets/:bucketId/fill', {
            templateUrl: 'views/buckets/fill.html'
        }).
        when('/buckets/:bucketId', {
            templateUrl: 'views/buckets/view.html'
        }).
        when('/musers', {
            templateUrl: 'views/musers/list.html'
        }).
        when('/musers/create', {
            templateUrl: 'views/musers/create.html'
        }).
        when('/musers/:muserId/edit', {
            templateUrl: 'views/musers/edit.html'
        }).
        when('/musers/:muserId', {
            templateUrl: 'views/musers/view.html'
        }).
        when('/logs', {
            templateUrl: 'views/logs/list.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);
