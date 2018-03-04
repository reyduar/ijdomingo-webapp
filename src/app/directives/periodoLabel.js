(function () {
    angular.module('app').directive("periodoLabel", PeriodoLabel);

    PeriodoLabelController.$inject = ['$scope', '$rootScope', '$log', '$timeout', '$state', '$localStorage'];

    function PeriodoLabelController($scope, $rootScope, $log, $timeout, $state, $localStorage) {
        var title = "Periodo lectivo activo: ";
        $scope.peridoActivo = title + "Aun no se fue seleccionado.";
       
        $scope.go = function(){
            $state.go('periodos');
        }
        
        $rootScope.$watch('periodo_lectivo', function() {
            $timeout(function () {
                if (!_.isEmpty($rootScope.periodo_lectivo)) {
                    $scope.peridoActivo = title + $rootScope.periodo_lectivo.nombre;
                } else {
                    $scope.peridoActivo = title + "Aun no se fue seleccionado.";
                }
            }, 1000);
        });
    };

    function PeriodoLabel() {
        return {
            restrict: "E",
            controller: PeriodoLabelController,
            templateUrl: "app/directives/periodoLabel.html",
            scope: {
                ngModel: "="
            }
        };
    };
})();