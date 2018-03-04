angular.module('app').controller('CursoController', CursoController);
    
function CursoController(CursoService, $log, $uibModal, $timeout, toastr){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de cursos
	self.listaCursos = function () {
		self.cursos = [];
		CursoService.obtenerCursos().then(function(response){
	    	self.cursos = response.data.cursos;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-cursos";
        self.exportData = [];
        // Headers:
        self.exportData.push(["Nombre"]);
        // Data:
        angular.forEach(self.cursos, function(value, key) {
            self.exportData.push([value.nombre]);
        });
    }

	// Metodo que llama al modal de nuevo curso
	self.mostrarAgregarCursoModal = function (curso) {
		var modalInstance = $uibModal.open({
		    controller: 'CursoModalController',
		    controllerAs: 'cursoModalCtrl',
		    templateUrl: 'app/controllers/curso.new.html',
		    size: 'lg',
            resolve: {
                cursoEdit: function () {
                    return curso;
                },
                acceso: function () {
                    return "cursos";
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaCursos() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
      			self.listaCursos();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listaCursos();
		});
	};

    // Metodo para mostrar modal del confirmacion para borrar un curso
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Curso",
            message: "¿Estas seguro que desea borrar este curso?",
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
                    CursoService.borrarCurso(id)
                    .then(function (response) {
                        self.cursos.splice(index, 1);
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
	self.listaCursos();
}

/* Filter to username */
angular.module('app').filter('searchFor', function () {
    return function (arr, cursoNombre) {
        if (!cursoNombre) {
            return arr;
        }
        var result = [];
        cursoNombre = cursoNombre.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.nombre.toLowerCase().indexOf(cursoNombre) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});