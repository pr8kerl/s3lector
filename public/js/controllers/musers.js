angular.module('mean.musers').controller('MusersController', ['$scope', '$routeParams', '$location', 'Global', 'Users', function ($scope, $routeParams, $location, Global, Users) {
    $scope.global = Global;

    $scope.create = function() {
        var muser = new Users({
            name: this.mname,
            username: this.musername,
            email: this.memail,
            access: this.maccess,
            password: this.mpassword
        }); 
        muser.$save(function(response) {
            $location.path("musers/" + response._id);
        }); 
    };  


    $scope.remove = function(muser) {
        if (muser) {
            muser.$remove();  

            for (var i in $scope.musers) {
                if ($scope.musers[i] == muser) {
                    $scope.musers.splice(i, 1);
                }
            }
        }
        else {
            $scope.muser.$remove();
            $location.path('musers');
        }
    };

    $scope.update = function() {
        var muser = $scope.muser;
        if (!muser.updated) {
            muser.updated = [];
        }
        muser.updated.push(new Date().getTime());

        muser.$update(function() {
            $location.path('musers/' + muser._id);
        });
    };

    $scope.find = function() {
        Users.query(function(musers) {
            $scope.musers = musers;
        });
    };

    $scope.findOne = function() {
        Users.get({
            muserId: $routeParams.muserId
        }, function(muser) {
            $scope.muser = muser;
        });
    };

}]);
