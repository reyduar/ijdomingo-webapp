angular.module('app').controller('DocenteController', DocenteController);
    
function DocenteController(toastr, ProvinciaService, DocenteService, $log, $uibModal, $timeout){
  
	var self = this;
  	self.mostarMensaje = false;
	
	// Metodo que genera la lista de docentes
	self.listaDocentes = function () {
		self.docentes = [];
		DocenteService.obtenerDocentes().then(function(response){
	    	self.docentes = response.data.docentes;
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
            "LOCALIDAD",
            "BARRIO",
            "DOMICILIO",
            "CELULAR",
            "FIJO",
            "EMAIL",
            "OCUPACION"]);
        // Data:
        angular.forEach(self.docentes, function(i, key) {
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

	// Metodo que llama al modal para editar o borrar un docente
	self.mostrarAgregarDocenteModal = function (docente) {
		var modalInstance = $uibModal.open({
		    controller: 'DocenteModalController',
		    controllerAs: 'docModalCtrl',
		    templateUrl: 'app/controllers/docente.new.html',
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
      			self.listaDocentes();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listaDocentes();
		});
	}

    self.verOnClick = function (item) {
        self.buscarProviciaPorId(item.localidad.provincia);
        $timeout(function () {
            var alumno = '';
            alumno += '<pre>';
            alumno += '<em>DNI: </em>' + item.dni;
            alumno += '<br ><em>Nombre: </em>' + item.nombre + ' ' + item.apellido
            alumno += '<br ><em>Sexo: </em>' + item.nombre;
            alumno += '<br ><em>Fecha de Nacimiento: </em>' + item.fecnac;
            alumno += '<br ><em>Nacionalidad: </em>' + item.nacionalidad.nombre;
            alumno += '<br ><em>Email: </em>' + item.email;
            alumno += '<br ><em>Celular: </em>' + item.celular;
            alumno += '<br ><em>Fijo: </em>' + item.fijo;
            alumno += '<br ><em>Provincia: </em>' +self.proNombre;
            alumno += '<br ><em>Localidad: </em>' + item.localidad.nombre;
            alumno += '<br ><em>Domicilio: </em>' + item.domicilio;
            alumno += '<br ><em>Barrio: </em>' + item.barrio;
            alumno += '<br ><em>Ocupación: </em>' + item.ocupacion;
            alumno += '</pre>';
            bootbox.alert({
                title: "Datos del Docente",
                message: alumno
            });
        }, 1000);
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
                    DocenteService.borrarDocente(id)
                    .then(function (response) {
                        //self.docentes.splice(index, 1);
                        self.listaDocentes();
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