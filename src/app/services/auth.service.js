angular.module('app').factory('AuthService', function AuthService($http, __env, $localStorage, $rootScope, jwtHelper, $log) {

    var service = {
        isAuthenticated : isAuthenticated,
        logout : logout,
        login: login,
        isTokenExpired: isTokenExpired
    };

    return service;

    function isTokenExpired(token) {
        var bool = jwtHelper.isTokenExpired(token);

        return bool;
        
    };

    function isAuthenticated() {
        if(jwtHelper.isTokenExpired($localStorage.token)){
            $rootScope.hasPermission = false;
            return true;
        }else{
            $rootScope.hasPermission = true;
            return false;
        }
    };

    function login(params) {
        var uri = __env.apiUrl + 'login';
        return $http({
            url: uri,
            method: "POST",
            data: params,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    function logout() {
        $localStorage.token = "";
        $rootScope.hasPermission = false;
    }
});