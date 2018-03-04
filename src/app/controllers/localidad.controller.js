angular.module('app').controller('LocalidadController', LocalidadController);
    
function LocalidadController(LocalidadService, $log, $uibModal, $timeout, toastr){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de localidades
	self.listarLocalidades = function () {
		self.localidades = [];
		LocalidadService.obtenerLocalidades().then(function(response){
	    	self.localidades = response.data.localidades;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-localidades";
        self.exportData = [];
        // Headers:
        self.exportData.push(["Localidad", "Provincia"]);
        // Data:
        angular.forEach(self.localidades, function(value, key) {
            self.exportData.push([value.nombre, value.provincia.nombre]);
        });
    }

	// Metodo que llama al modal de agregar alumnos
	self.mostrarAgregarLocalidadModal = function (localidad) {
		var modalInstance = $uibModal.open({
		    controller: 'LocalidadModalController',
		    controllerAs: 'localidadModalCtrl',
		    templateUrl: 'app/controllers/localidad.new.html',
		    size: 'lg',
            resolve: {
                localidadEdit: function () {
                    return localidad;
                },
                acceso: function () {
                    return "localidades";
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listarLocalidades() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
      			self.listarLocalidades();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listarLocalidades();
		});
	}

    // Metodo para mostrar modal del confirmacion para borrar una Localidad
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Localidad",
            message: "¿Estas seguro que desea borrar esta localidad?",
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
                    LocalidadService.borrarLocalidad(id)
                    .then(function (response) {
                        self.localidades.splice(index, 1);
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
    }

    self.dismissAlert = function() {
        self.mostarMensaje = false;
    };
    
  	// Hago la llamada a todos los servicios que traer datos
	self.listarLocalidades();
}

/* Filtro por nombre de localidad */
angular.module('app').filter('searchByLocalidadNombre', function () {
    return function (arr, localidadNombre) {
        if (!localidadNombre) {
            return arr;
        }
        var result = [];
        localidadNombre = localidadNombre.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.nombre.toLowerCase().indexOf(localidadNombre) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});