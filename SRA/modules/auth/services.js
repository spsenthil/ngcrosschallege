'use strict';
 
angular.module('Authentication',[])
 
.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
    function ( $http, $cookieStore, $rootScope, $timeout) {
        var service = {};


        var md5 = function(value) {
            return CryptoJS.MD5(value).toString();
        };

        var hexToBase64=function(str) {
            return btoa(String.fromCharCode.apply(null,
                str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
            );
        };

        var randomToken=function() {
            var rand = function () {
                return Math.random().toString(36).substr(2); // remove `0.`
            };

            var token = function () {
                return rand() + rand(); // to make it longer
            };

            return token();
        }
        var  getAuthRequest=function(creds){
            /*User name
            Base64 encode of MD5 password
            Random 32 bit token
            Digest = Base64 encode of MD5(username + "," + password hash + "," + token)
            */
            var authReq={};
            //authReq.username=creds.username;
            var passwordHash=hexToBase64(md5(creds.password));
            //authReq.password=passwordHash;
            var rToken=randomToken();
            authReq.token=rToken;
            authReq.digest=hexToBase64(md5(creds.username+","+passwordHash+","+rToken));
            authReq.user={};
            authReq.user.username=creds.username;
            authReq.user.password=passwordHash;


            return authReq;
        }

        service.Login = function (username, password, callback) {

           var authReq=getAuthRequest({username:username,password:password});

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            /*$timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);*/

            $http({
                method: 'POST',
                dataType: "json",
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                url: 'http://localhost:8080/SRA/authenticate'
                ,data:authReq
            }).then(callback)



            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });

        };
 
        service.SetCredentials = function (authData) {
 
            $rootScope.globals = {
                authData: authData,
                getSessionId:function(){
                    this.authData.sessionId
                }
            };

            var httpDefaults=$http.defaults;
            httpDefaults.sessionId=authData.sessionId;
            httpDefaults.dataType = "json",
                httpDefaults.headers = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                };

           // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            //$http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }]);