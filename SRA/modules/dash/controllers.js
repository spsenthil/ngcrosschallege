'use strict';

angular.module('DashBoard', [])
    .controller('DashboardController',
        ['$scope', '$rootScope', '$location', 'Customer', 'ngToast','$route','$window',
            function ($scope, $rootScope, $location, Customer, ngToast,$route,$window) {
                $rootScope.hideMenus = false;

                    $scope.preFlightDone=false;
                var authData = $rootScope.globals.authData;

                $scope.loadMenuPage = function (menu) {
                    $location.path(('/'+menu));
                };

                /**
                 * Due to CORS, it Fails for the first time
                 */
                $scope.initPreFlight = function () {
                    Customer.preFlight({sessionId: authData.sessionId},
                        function (data) {
                            $scope.preFlightDone=true;
                        }
                        ,
                        function(data) {
                            //$window.location.reload();
                            $scope.preFlightDone=true;

                        }
                    );

                };

                $scope.initPreFlight();


            }]);