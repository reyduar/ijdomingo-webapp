angular.module('app').controller('CursoController', CursoController);
    
function CursoController(ApiService, $log, $uibModal, $timeout){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de cursos
	self.listaCursos = function () {
		self.cursos = [];
		ApiService.obtenerCursos().then(function(response){
	    	self.cursos = response.data.curso;
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

	// Metodo que llama al modal de agregar alumnos
	self.mostrarAgregarCursoModal = function (id, nombre) {
        var curso = { "id": id, "nombre": nombre };
		var modalInstance = $uibModal.open({
		    controller: 'CursoModalController',
		    controllerAs: 'cursoModalCtrl',
		    templateUrl: 'app/views/cursoModal.html',
		    size: 'lg',
            resolve: {
                cursoEdit: function () {
                    return curso;
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaCursos() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                alerta("__exito_al_editar");
      			self.listaCursos();
      		} if(resultado.stateEdition == 'error'){
                alerta("__error_al_editar");
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listaCursos();
		});
	}

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
                    ApiService.borrarCurso(id)
                    .then(function (response) {
                        self.cursos.splice(index, 1);
                        alerta("__exito_al_borrar");
                    }, function (error) {
                        alerta("__error_al_borrar");
                    });
                }
            }
        });
    };

	// Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_borrar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al borrar el curso.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_borrar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Curso borrado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__exito_al_editar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Curso editado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_editar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al editar el curso.";
                self.alert = 'alert alert-danger ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

    self.dismissAlert = function() {
        self.mostarMensaje = false;
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