(function () {
    angular.module('app').directive("usuarioLabel", UsuarioLabel);

    UsuarioLabelController.$inject = ['AuthService', '$scope', '$rootScope', '$log', '$timeout', '$state', '$localStorage'];

    function UsuarioLabelController(AuthService, $scope, $rootScope, $log, $timeout, $state, $localStorage) {
        
        $scope.usuarioNombre = $localStorage.usuario;

        $scope.cerrar = function () {
            AuthService.logout();
             $timeout(function () {
                 $state.go('login');
            }, 1000);
        };
       
    };

    function UsuarioLabel() {
        return {
            restrict: "E",
            controller: UsuarioLabelController,
            templateUrl: "app/directives/usuarioLabel.html",
            scope: {
                ngModel: "="
            }
        };
    };
})();