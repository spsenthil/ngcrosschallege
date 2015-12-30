'use strict';

// declare modules


angular.module('salesRepApp', [
        'Authentication',
        'Home',
        'DashBoard',
        'ngRoute',
        'ngCookies',
        'ngResource', 'ngTouch', 'datePicker', 'timepickerPop', 'ui.bootstrap', 'smart-table', 'ngToast'
    ])

    .constant("APP_CONSTANTS", {
        "CUSTOMER_URL": "http://localhost:8080/SRA/customer/"
    })
    .config(['$routeProvider', '$resourceProvider', '$httpProvider', function ($routeProvider, $resourceProvider, $httpProvider) {

        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'modules/auth/views/login.html'
            })

            .when('/dash', {
                controller: 'DashboardController',
                templateUrl: 'modules/dash/views/dashboard.html'
            }).when('/home', {
                controller: 'HomeController',
                templateUrl: 'modules/home/views/home.html'
            })
            .when('/details/:id', {
                controller: 'DetailsController',
                templateUrl: 'modules/home/views/details.html'
            })

            .otherwise({redirectTo: '/login'});

        $resourceProvider.defaults.stripTrailingSlashes = false;

        $httpProvider.defaults.headers.common = {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        };

        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        };


    }])
    .run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.authData) {
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.authData; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/login' && !$rootScope.globals.authData) {
                    $location.path('/login');
                }
            });
        }])
    .controller('NavigationController', ['$rootScope', '$scope', '$http', '$location', 'AuthenticationService', function ($rootScope, $scope, $http, $location, AuthenticationService) {
        $rootScope.hideMenus = true;
        $rootScope.loggedInToHome = true;


        $scope.logout = function () {
            if ($rootScope.globals && $rootScope.globals.authData && $rootScope.globals.authData.sessionId) {
                var handleLogout = function (data) {
                    AuthenticationService.ClearCredentials();
                    $scope.hideMenus = true;
                    $location.path('/login');
                };

                $http({
                    method: 'POST',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    },
                    url: 'http://localhost:8080/SRA/logout'
                    , data: {"sessionId": $rootScope.globals.authData.sessionId}
                }).then(handleLogout)
            }
            else {
                handleLogout();
            }


        }
    }]).directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });
;