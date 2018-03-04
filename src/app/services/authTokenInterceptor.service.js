angular.module('app').factory('AuthTokenInterceptor', ['$rootScope', '$q', '$localStorage', '$injector', 
function ($rootScope, $q, $localStorage, $injector) {
    return {
        request: function (config) {
            
            var authToken = $localStorage.token;
            config.headers = config.headers || {};

            if (authToken) {
                config.headers.Authorization = authToken;
            }

            return config || $q.when(config);

        },
        responseError: function(response) {
          
          if (response.status === 401) {
            var $state = $injector.get('$state');
            $localStorage.token = "";
            $rootScope.hasPermission = false;
            $state.go('login');
          }
          return $q.reject(response);
        }
    };
}])