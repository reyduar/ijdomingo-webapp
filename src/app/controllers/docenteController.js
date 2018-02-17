angular.module('app').controller('DocenteController', DocenteController);
    
function DocenteController(ApiService, $log, $uibModal, $timeout){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de docentes
	self.listaDocentes = function () {
		self.docentes = [];
		ApiService.obtenerDocentes().then(function(response){
	    	self.docentes = response.data.docentes;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-docentes";
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", 
            "NOMBRE", 
            "APELLIDO", 
            "NACIONALIDAD", 
            "FECHA NACIMIENTO", 
            "SEXO", 
            "PROVINCIA",
            "BARRIO",
            "DOMICILIO",
            "CELULAR",
            "FIJO",
            "EMAIL",
            "OCUPACION"]);
        // Data:
        angular.forEach(self.docentes, function(i, key) {
             self.exportData.push([i.dni,
                i.nombre,
                i.apellido,
                i.nacionalidad,
                i.fecnac,
                i.sexo,
                i.provincia,
                i.barrio,
                i.domicilio,
                i.celular,
                i.fijo,
                i.email,
                i.ocupacion]);
        });
    }

	// Metodo que llama al modal para editar o borrar un docente
	self.mostrarAgregarDocenteModal = function (docente) {
		var modalInstance = $uibModal.open({
		    controller: 'DocenteModalController',
		    controllerAs: 'docModalCtrl',
		    templateUrl: 'app/views/agregarDocente.html',
		    size: 'lg',
            resolve: {
                docenteEdit: function () {
                    return docente;
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaDocentes() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                alerta("__exito_al_editar");
      			self.listaDocentes();
      		} if(resultado.stateEdition == 'error'){
                alerta("__error_al_editar");
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listaDocentes();
		});
	}

    self.verOnClick = function(item){
        var alumno = '';
        alumno += '<pre>';
        alumno += '<em>DNI: </em>'+ item.dni;
        alumno += '<br ><em>Nombre: </em>'+ item.nombre +' '+item.apellido
        alumno += '<br ><em>Sexo: </em>'+ item.nombre;
        alumno += '<br ><em>Fecha de Nacimiento: </em>'+ item.fecnac;
        alumno += '<br ><em>Nacionalidad: </em>'+ item.nacionalidad;
        alumno += '<br ><em>Email: </em>'+ item.email;
        alumno += '<br ><em>Celular: </em>'+ item.celular;
        alumno += '<br ><em>Fijo: </em>'+ item.fijo;
        alumno += '<br ><em>Provincia: </em>'+ item.provincia;
        alumno += '<br ><em>Localidad: </em>'+ item.localidad;
        alumno += '<br ><em>Domicilio: </em>'+ item.domicilio;
        alumno += '<br ><em>Barrio: </em>'+ item.barrio;
        alumno += '<br ><em>Ocupación: </em>'+ item.ocupacion;
        alumno += '</pre>';
        bootbox.alert({
            title: "Datos del Docente",
            message: alumno
        });
    }

    // Metodo para mostrar modal del confirmacion para borrar un docente
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Docente",
            message: "¿Estas seguro que desea borrar este docente?",
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
                    ApiService.borrarDocente(id)
                    .then(function (response) {
                        //self.docentes.splice(index, 1);
                        self.listaDocentes();
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
                self.alertMsg = "Error al borrar el docente.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_borrar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Docente borrado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__exito_al_editar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Docente editado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_editar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al editar el docente.";
                self.alert = 'alert alert-danger ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

  	// Hago la llamada a todos los servicios que traer datos
	self.listaDocentes();
}

/* Filter to username */
angular.module('app').filter('searchDocenteForDni', function () {
    return function (arr, docenteDni) {
        if (!docenteDni) {
            return arr;
        }
        var result = [];
        docenteDni = docenteDni.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.dni.toLowerCase().indexOf(docenteDni) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});