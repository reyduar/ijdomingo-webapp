angular.module('app').controller('ProvinciaController', ProvinciaController);
    
function ProvinciaController(ProvinciaService, $log, $uibModal, $timeout, toastr){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de provincias
	self.listarProvincias = function () {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
	    	self.provincias = response.data.provincias;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-provincias";
        self.exportData = [];
        // Headers:
        self.exportData.push(["Nombre"]);
        // Data:
        angular.forEach(self.provincias, function(value, key) {
            self.exportData.push([value.nombre]);
        });
    }

	// Metodo que llama al modal de agregar alumnos
	self.mostrarAgregarProvinciaModal = function (provincia) {
		var modalInstance = $uibModal.open({
		    controller: 'ProvinciaModalController',
		    controllerAs: 'provinciaModalCtrl',
		    templateUrl: 'app/controllers/provincia.new.html',
		    size: 'lg',
            resolve: {
                provinciaEdit: function () {
                    return provincia;
                },
                acceso: function () {
                    return "provincias";
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listarProvincias() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
      			self.listarProvincias();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listarProvincias();
		});
	}

    // Metodo para mostrar modal del confirmacion para borrar una provincia
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Provincia",
            message: "¿Estas seguro que desea borrar este Provincia?",
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
                    ProvinciaService.borrarProvincia(id)
                    .then(function (response) {
                        self.provincias.splice(index, 1);
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
    
  	// Hago la llamada a todos los servicios que traer datos
	self.listarProvincias();
}

/* Filter to username */
angular.module('app').filter('searchByProvinciaNombre', function () {
    return function (arr, provinciaNombre) {
        if (!provinciaNombre) {
            return arr;
        }
        var result = [];
        provinciaNombre = provinciaNombre.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.nombre.toLowerCase().indexOf(provinciaNombre) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});