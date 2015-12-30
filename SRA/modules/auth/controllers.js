angular.module('Authentication').controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
        function ($scope, $rootScope, $location, AuthenticationService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function(response) {
                    var data=response.data;
                    if(data.message==="Login Successful") {
                        AuthenticationService.SetCredentials(data);
                        $location.path('/dash');
                    } else {
                        $scope.error = data.message;
                        $scope.dataLoading = false;
                    }
                });
            };
        }]);