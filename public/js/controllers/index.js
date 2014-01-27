angular.module('mean.s3objects').controller('S3ObjectsController', ['$scope', '$routeParams', '$location', '$modal', 'Global', 'S3Objects', function ($scope, $routeParams, $location, $modal, Global, S3Objects) {

	$scope.global = Global;
	$scope.detail = {};

  $scope.orderProp = '-mtime';
  $scope.opts = { 
    backdropFade: true,
    dialogFade:true
  };  

	$scope.openModal = function (obj) {

    console.log('modal id: %s',obj._id);
    console.log(obj);
		$scope.detail = obj;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
            controller: function ($scope, $modalInstance, detail) {
								$scope.detail = detail;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.download = function (product) {
									console.log('modal download: %s',product._id);
                };
            },
      resolve: {
				detail: function () {
					return obj;
				}
			}
    });

    modalInstance.result.then(function (currentIndex) {
//      $scope.currentIndex = selectedItem;
//    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

    $scope.create = function() {
        var s3object = new S3Object({
            name: this.name,
            size: this.size
        });
        s3object.$save(function(response) {
            $location.path("objects/" + response._id);
        });

        this.name = "";
    };

    $scope.remove = function(s3object) {
        if (s3object) {
            s3object.$remove();  

            for (var i in $scope.s3objects) {
                if ($scope.s3objects[i] == s3object) {
                    $scope.s3objects.splice(i, 1);
                }
            }
        }
        else {
            $scope.s3object.$remove();
            $location.path('objects');
        }
    };

    $scope.update = function() {
        var s3object = $scope.s3object;
        if (!s3object.updated) {
            s3object.updated = [];
        }

        s3object.$update(function() {
            $location.path('objects/' + s3object._id);
        });
    };

    $scope.find = function() {
        S3Objects.query(function(s3objects) {
            $scope.s3objects = s3objects;
        });
    };

    $scope.findOne = function() {
        S3Objects.get({
            s3objectId: $routeParams.s3objectId
        }, function(s3object) {
            $scope.s3object = s3object;
        });
    };
}]);
