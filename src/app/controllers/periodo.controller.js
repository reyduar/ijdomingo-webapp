angular.module('app').controller('PeriodoController', PeriodoController);
    
function PeriodoController(PeriodoService, $log, $uibModal, $timeout, toastr){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de periodos
	self.listarPeriodos = function () {
		self.periodos = [];
		PeriodoService.obtenerPeriodos().then(function(response){
	    	self.periodos = response.data.periodos;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-periodos-lectivo";
        self.exportData = [];
        // Headers:
        self.exportData.push(["Nombre", "Descripción"]);
        // Data:
        angular.forEach(self.periodos, function(value, key) {
            self.exportData.push([value.nombre, value.descripcion]);
        });
    }

	// Metodo que llama al modal de agregar periodos lectivos
	self.mostrarModalNuevoPeriodo = function (id, nombre, descripcion) {
        var periodo = { "id": id, "nombre": nombre, "descripcion": descripcion };
		var modalInstance = $uibModal.open({
		    controller: 'PeriodoModalController',
		    controllerAs: 'periodoModalCtrl',
		    templateUrl: 'app/controllers/periodo.new.html',
		    size: 'lg',
            resolve: {
                periodoEdit: function () {
                    return periodo;
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listarPeriodos() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
      			self.listarPeriodos();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listarPeriodos();
		});
	}

    // Metodo para mostrar modal del confirmacion para borrar un periodo
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Período Lectivo",
            message: "¿Estas seguro que desea borrar este período?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> No'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Si'
                }
            },
            callback: function (result) {
                if(result){
                    PeriodoService.borrarPeriodo(id)
                    .then(function (response) {
                        self.periodos.splice(index, 1);
                        self.showMessage(response.data.message, 'success');
                    }, function (error) {
                        self.showMessage(error.data.message, 'error');
                    });
                }
            }
        });
    };

    /* Method to create toastr notifications*/
    self.showMessage = function (message, type) {
        if(type == 'error'){
          toastr.error(message);
        }
        if(type == 'success'){
          toastr.success(message);
        }
        if(type == 'warning'){
          toastr.warning(message);
        }
        if(type == 'info'){
          toastr.info(message);
        }
    };
    
  	// Hago la llamada a todos los servicios que traer datos
	self.listarPeriodos();
}

/* Filter por el nombre de periodo */
angular.module('app').filter('searchByPeriodoNombre', function () {
    return function (arr, periodoNombre) {
        if (!periodoNombre) {
            return arr;
        }
        var result = [];
        periodoNombre = periodoNombre.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.nombre.toLowerCase().indexOf(periodoNombre) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});