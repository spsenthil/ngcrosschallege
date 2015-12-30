'use strict';

angular.module('Home', [])
    .factory('Customer', ['$resource', '$rootScope', '$http','APP_CONSTANTS','$window', function ($resource, $rootScope, $http,APP_CONSTANTS,$window) {

        function resourceErrorHandler(response) {
            $window.location.reload();
        }


        interceptor : {responseError : resourceErrorHandler}

        //var baseUrl = 'http://localhost:8080/SRA/customer/';
        var Customer = $resource(APP_CONSTANTS.CUSTOMER_URL, {},
            {
                'preFlight': {
                    method: 'POST',
                    url: APP_CONSTANTS.CUSTOMER_URL + 'list',
                    interceptor : {responseError : resourceErrorHandler}
                },
                'list': {
                    method: 'POST',
                    url: APP_CONSTANTS.CUSTOMER_URL + 'list',
                    interceptor : {responseError : resourceErrorHandler}
                },
                'details': {
                    method: 'POST',
                    url: APP_CONSTANTS.CUSTOMER_URL + 'details',
                    interceptor : {responseError : resourceErrorHandler}
                },
                'savevisit': {
                    method: 'POST',
                    url: APP_CONSTANTS.CUSTOMER_URL + 'savevisit',
                    interceptor : {responseError : resourceErrorHandler}
                },
                'savenotes': {
                    method: 'POST',
                    url: APP_CONSTANTS.CUSTOMER_URL + 'savenotes',
                    interceptor : {responseError : resourceErrorHandler}
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'charset':'utf8',
                    'Accept': '*/*',
                    dataType: "json"
                }
            }
        );

        return Customer;
    }])
    .controller('HomeController',
        ['$scope', '$rootScope', '$location', 'Customer','ngToast','$routeParams','$window',
            function ($scope, $rootScope, $location, Customer,ngToast,$routeParams,$window) {
                $rootScope.hideMenus = false;
                $scope.rowCollection = [];
                $scope.displayedCollection = [];

                $scope.itemsByPage=5;
                var authData = $rootScope.globals.authData;


                $scope.viewDetails = function (row) {
                    $location.path('/details/' + row.id);
                };

                $scope.loadCustomers=function(){
                    Customer.list({sessionId:authData.sessionId},
                        function (data) {
                            $scope.rowCollection = data.data;
                            $scope.displayedCollection=[].concat(angular.copy(data.data));
                        },
                        function(data) {
                            $window.location.reload();
                        }
                    );

                    if($routeParams.id){
                        $location.path('/home');
                    }
                };


                $scope.loadCustomers();




            }]).controller('DetailsController',
    ['$scope', '$rootScope', '$routeParams', 'Customer','ngToast',
        function ($scope, $rootScope, $routeParams, Customer,ngToast) {

            $rootScope.hideMenus = false;

            var customerId = $routeParams.id;
            var sessionId=$rootScope.globals.authData.sessionId;
            $scope.customerDetails = {
                newStatus:'',
                newNotes:''
            };
            $scope.detailsLoading=true;

            $scope.activeTab='notesTab';


            function bindCustomerDetail(data){

                $scope.detailsLoading=false;
                $scope.dataSaveInProgress=false;
                $scope.customerDetails = data.data;
                $scope.customerDetails.newStatus=$scope.customerDetails.status;
                $scope.customerDetails.newNotes=$scope.customerDetails.notes;

            }

            Customer.details({
                sessionId: sessionId,
                customerid: customerId
            }, bindCustomerDetail);





            $scope.saveChanges=function(activeTab){
                $scope.dataSaveInProgress=true;
                if(activeTab==='notesTab')
                {
                    //{ "sessionId" : "75984292-af89-4280-8aac-7f15b4e3a1ba", "customerid" : "36", "status" : "InProgress", "notes" : "Final Test" }
                    Customer.savenotes({
                        sessionId: sessionId,
                        customerid: customerId,
                        status:$scope.customerDetails.newStatus,
                        notes:$scope.customerDetails.newNotes,
                    },function(data){

                        ngToast.create({
                            className: 'success',
                            animation:'slide',
                            content: 'Notes Saved Successfully',
                            additionalClasses: 'toast-animation'
                        });

                        bindCustomerDetail(data)
                    });
                }
                else if(activeTab==='visitTab')
                {
                    var custVisit=$scope.customerDetails.visit;
                    //{ "sessionId" : "75984292-af89-4280-8aac-7f15b4e3a1ba", "customerid" : "36", "visit" : { "date" : "2015-06-06", "time" : "3:30 PM", "action" : "Lead", "notes" : "Testing session management" } }
                    Customer.savevisit({
                        sessionId: sessionId,
                        customerid: customerId,
                        visit:{
                            date:custVisit.date,
                            time:custVisit.time,
                            action:custVisit.action,
                            notes:custVisit.notes
                        }
                    },function(data){

                        ngToast.create({
                            className: 'success',
                            animation:'slide',
                            content: 'Visit Saved Successfully',
                            additionalClasses: 'toast-animation'
                        });
                        bindCustomerDetail(data)
                    });
                }
            }


        }]);