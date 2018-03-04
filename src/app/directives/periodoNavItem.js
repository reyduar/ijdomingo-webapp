(function () {
    angular.module('app').directive("periodoNavItem", PeriodoNavItem);

    PeriodoNavItemController.$inject = ['$scope', '$state', 'PeriodoService', '$rootScope', '$log', 'toastr', '$timeout'];

    function PeriodoNavItemController($scope, $state, PeriodoService, $rootScope, $log, toastr, $timeout) {

        PeriodoService.obtenerPeriodos().then(function (response) {
                if (_.isEmpty(response.data)) {
                    toastr.info("Debera crear un periodo lectivo para operar.");
                } else {
                    $scope.periodos = response.data.periodos;
                    var peridoActivo = _.find($scope.periodos, { estado: true });
                    if (!_.isEmpty(peridoActivo)){
                        $rootScope.periodo_lectivo = peridoActivo;
                        $scope.periodo = peridoActivo;
                    }else{
                        toastr.info("Necesita seleccionar periodo lectivo para operar.");
                    }       
                        
                }
            });

            $scope.cerrar = function () {
                $localStorage.token = "";
                $rootScope.hasPermission = false;
                 $timeout(function () {
                     $state.go('login');
                }, 1000);
            }

        $scope.periodoSelected = function ($item) {
            // Desactivo el anterior periodo
            var peridoActivo = _.find($scope.periodos, { estado: true });
            if(!_.isEmpty(peridoActivo)){
                PeriodoService.editarPeriodo($rootScope.periodo_lectivo._id, { "estado": false }).then(function (response) {
                    $log.info("Periodo Desactivado:"+ JSON.stringify($rootScope.periodo_lectivo.nombre));
                });
            }
            
            $timeout(function () { 
                // Activo el nuevo periodo
                PeriodoService.editarPeriodo($item._id, { "estado": true }).then(function (response) {
                    $rootScope.periodo_lectivo = $item;
                    toastr.info("El perido lectivo "+ $item.nombre + " quedará seleccionado para operar en todo el sistema.");
                });
             }, 1000);
            
        };


    };

    function PeriodoNavItem() {
        return {
            restrict: "E",
            controller: PeriodoNavItemController,
            templateUrl: "app/directives/periodoNavItem.html",
            scope: {
                ngModel: "="
            }
        };
    };
})();