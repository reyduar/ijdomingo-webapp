angular.module('app').controller('AlumnoController', AlumnoController);
    
function AlumnoController(ApiService, $log, $uibModal, $timeout, $window, $filter, uibDateParser){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de alumnos
	self.listaAlumnos = function () {
		self.alumnos = [];
		ApiService.obtenerAlumnos().then(function(response){
	    	self.alumnos = response.data.alumnos;
            self.exportarEXcel();
		});
	}

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-alumnos";
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
        angular.forEach(self.alumnos, function(i, key) {
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

	// Metodo que llama al modal de agregar alumnos
	self.mostrarAgregarAlumnoModal = function (alumno) {
		var modalInstance = $uibModal.open({
		    controller: 'AlumnoModalController',
		    controllerAs: 'alumnoModalCtrl',
		    templateUrl: 'app/views/agregarAlumno.html',
		    size: 'lg',
            resolve: {
                alumnoEdit: function () {
                    return alumno;
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaAlumnos() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                alerta("__exito_al_editar");
                self.listaAlumnos()
            } if(resultado.stateEdition == 'error'){
                alerta("__error_al_editar");
            }
      		
    	}, function () {
    		// Cuando el modal se cierra
    		self.listaAlumnos();
		});
	}

    // Metodo para mostrar modal del confirmacion para borrar un alumno
    self.borrarOnClick = function(index, id) {
        bootbox.confirm({
            title: "Borrar Alumno",
            message: "¿Estas seguro que desea borrar este alumno?",
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
                    ApiService.borrarAlumno(id)
                    .then(function (response) {
                        //self.alumnos.splice(index, 1);
                        self.listaAlumnos();
                        alerta("__exito_al_borrar");
                    }, function (error) {
                        alerta("__error_al_borrar");
                    });
                }
            }
        });
    };


    self.verOnClick = function(item){
        var alumno = '';
        alumno += '<pre>';
        alumno += '<em>DNI: </em>'+ item.dni;
        alumno += '<br ><em>Nombre: </em>'+ item.nombre +' '+item.apellido
        alumno += '<br ><em>Sexo: </em>'+ item.sexo;
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
            title: "Datos del Alumno",
            message: alumno
        });
    }

    

	// Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_borrar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al borrar el alumno.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_borrar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Alumno borrado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__exito_al_editar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Alumno editado con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_editar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al editar el alumno.";
                self.alert = 'alert alert-danger ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

    self.dismissAlert = function() {
        self.mostarMensaje = false;
    };

  	// Hago la llamada a todos los servicios que traer datos
	self.listaAlumnos();
}

/* Filtrar por DNI */
angular.module('app').filter('FiltrarAlumnoDni', function () {
    return function (arr, alumnoDni) {
        if (!alumnoDni) {
            return arr;
        }
        var result = [];
        alumnoDni = alumnoDni.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.dni.toLowerCase().indexOf(alumnoDni) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});