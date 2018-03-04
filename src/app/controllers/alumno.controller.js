angular.module('app').controller('AlumnoController', AlumnoController);
    
function AlumnoController(ProvinciaService, AlumnoService, $log, $uibModal, $timeout, $window, $filter, uibDateParser, toastr){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de alumnos
	self.listaAlumnos = function () {
		self.alumnos = [];
		AlumnoService.obtenerAlumnos().then(function(response){
	    	self.alumnos = response.data.alumnos;
            self.exportarEXcel();
		});
    }
    
    // Buscar provincia por id
	self.buscarProviciaPorId = function (id) {
		ProvinciaService.obtenerProvinciaPorId(id).then(function(response){
	    	self.proNombre =  response.data.provincia.nombre;
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
            "LOCALIDAD",
            "BARRIO",
            "DOMICILIO",
            "CELULAR",
            "FIJO",
            "EMAIL",
            "OCUPACION"]);
        // Data:
        angular.forEach(self.alumnos, function(i, key) {
            self.buscarProviciaPorId(i.localidad.provincia);
            $timeout(function () { 
                self.exportData.push([i.dni,
                    i.nombre,
                    i.apellido,
                    i.nacionalidad.nombre,
                    i.fecnac,
                    i.sexo,
                    self.proNombre,
                    i.localidad.nombre,
                    i.barrio,
                    i.domicilio,
                    i.celular,
                    i.fijo,
                    i.email,
                    i.ocupacion]);
             }, 1000);
        });
    }

	// Metodo que llama al modal de agregar alumnos
	self.mostrarAgregarAlumnoModal = function (alumno) {
        //$log.info("alumno: "+ JSON.stringify(alumno));
		var modalInstance = $uibModal.open({
		    controller: 'AlumnoModalController',
		    controllerAs: 'alumnoModalCtrl',
		    templateUrl: 'app/controllers/alumno.new.html',
		    size: 'lg',
            resolve: {
                alumnoEdit: function () {
                    return alumno;
                },
                acceso: function () {
                    return "alumnos";
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaAlumnos() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                self.listaAlumnos()
            } if(resultado.stateEdition == 'error'){
                // error al editar
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
                    AlumnoService.borrarAlumno(id)
                    .then(function (response) {
                        //self.alumnos.splice(index, 1);
                        self.listaAlumnos();
                        self.showMessage(response.data.message, 'success');
                    }, function (error) {
                        self.showMessage(error.data.message, 'error');
                    });
                }
            }
        });
    };


    self.verOnClick = function(item){
        self.buscarProviciaPorId(item.localidad.provincia);
        $timeout(function () { 
            var alumno = '';
            alumno += '<pre>';
            alumno += '<em>DNI: </em>'+ item.dni;
            alumno += '<br ><em>Nombre: </em>'+ item.nombre +' '+item.apellido
            alumno += '<br ><em>Sexo: </em>'+ item.sexo;
            alumno += '<br ><em>Fecha de Nacimiento: </em>'+ item.fecnac;
            alumno += '<br ><em>Nacionalidad: </em>'+ item.nacionalidad.nombre;
            alumno += '<br ><em>Email: </em>'+ item.email;
            alumno += '<br ><em>Celular: </em>'+ item.celular;
            alumno += '<br ><em>Fijo: </em>'+ item.fijo;
            alumno += '<br ><em>Provincia: </em>'+ self.proNombre;
            alumno += '<br ><em>Localidad: </em>'+ item.localidad.nombre;
            alumno += '<br ><em>Domicilio: </em>'+ item.domicilio;
            alumno += '<br ><em>Barrio: </em>'+ item.barrio;
            alumno += '<br ><em>Ocupación: </em>'+ item.ocupacion;
            alumno += '</pre>';
                bootbox.alert({
                    title: "Datos del Alumno",
                    message: alumno
                });
        }, 1000);
    }

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