angular.module('mean.buckets').controller('BucketsController', ['$scope', '$routeParams', '$location', 'Global', 'Buckets', function ($scope, $routeParams, $location, Global, Buckets) {
    $scope.global = Global;

    $scope.create = function() {
        var bucket = new Buckets({
            name: this.name,
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
            region: this.region,
            prefix: this.prefix,
            access: this.access
        });
				console.log(bucket);
        bucket.$save(function(response) {
            $location.path("buckets/" + response._id);
        });

        this.name = "";
    };

    $scope.remove = function(bucket) {
        if (bucket) {
            bucket.$remove();  

            for (var i in $scope.buckets) {
                if ($scope.buckets[i] == bucket) {
                    $scope.buckets.splice(i, 1);
                }
            }
        }
        else {
            $scope.bucket.$remove();
            $location.path('buckets');
        }
    };

    $scope.update = function() {
        var bucket = $scope.bucket;
        if (!bucket.updated) {
            bucket.updated = [];
        }
        bucket.updated.push(new Date().getTime());

        bucket.$update(function() {
            $location.path('buckets/' + bucket._id);
        });
    };

    $scope.find = function() {
        Buckets.query(function(buckets) {
            $scope.buckets = buckets;
        });
    };

    $scope.findOne = function() {
        Buckets.get({
            bucketId: $routeParams.bucketId
        }, function(bucket) {
            $scope.bucket = bucket;
        });
    };

    $scope.fill = function() {
//        var bucket = $scope.bucket;
        Buckets.get({
            bucketId: $routeParams.bucketId
        }, function(bucket) {
            $scope.bucket = bucket;
        });
        Buckets.fill({
            bucketId: $routeParams.bucketId
        }, function(bucket) {
            $scope.bucket = bucket;
						console.log("bucket filled: %s",$routeParams.bucketId);
            $location.path('buckets/' + bucket._id);
        });
    };
}]);
