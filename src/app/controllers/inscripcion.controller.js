angular.module('app').controller('InscripcionController', InscripcionController);

function InscripcionController(InscripcionService, CursoService, ProvinciaService, LocalidadService, AlumnoService, $log, $uibModal, $timeout, $state, $rootScope, toastr) {

    var self = this;
    self.curso = undefined;
    self.provincia = undefined;
    self.localidad = undefined;
    self.alumno = undefined;
    self.verlista = false;
    // Metodo que genera la lista de inscripciones
    self.listaInscripciones = function () {
        self.inscripciones = [];
        if (!_.isEmpty(self.curso) && !_.isEmpty(self.provincia) && !_.isEmpty(self.localidad)) {
            // nada
        } else {
            $timeout(function () {
                if (!_.isEmpty($rootScope.periodo_lectivo)) {
                    InscripcionService.buscarInscripcionesPorPeriodo($rootScope.periodo_lectivo._id).then(function (response) {
                        self.inscripciones = response.data.inscripciones;
                       // $log.info(JSON.stringify(self.inscripciones));
                        self.exportarEXcel();
                        self.verLista();
                    });
                } else {
                    self.showMessage('No existe un periodo lectivo activo', 'info');
                }
            }, 2000);
        }
    }

    self.verLista = function () {
        if (_.isEmpty(self.inscripciones))
            self.verlista = false;
        else    
            self.verlista = true;
    };

    self.enterSearch = function (keyEvent) {
        if (keyEvent.which === 13)
            self.buscarAlumnoPorDni();
    }

    self.restarFiltro = function () {
        self.curso = undefined;
        self.listaInscripciones();
    }

    // Metodo que genera la lista de cursos
    self.obtenerCursos = function () {
        self.cursos = [];
        CursoService.obtenerCursos().then(function (response) {
            self.cursos = response.data.cursos;
        });
    }

    // Metodo que llama al modal de nuevo curso
	self.editarInscripciones = function (inscripcion) {
		var modalInstance = $uibModal.open({
		    controller: 'EditarInscripcionController',
		    controllerAs: 'editInsCtrl',
		    templateUrl: 'app/controllers/inscripcion.edit.html',
		    size: 'lg',
            resolve: {
                inscripcionEdit: function () {
                    return inscripcion;
                }
            }
		});

		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaInscripciones() : $log.log("Nothing to do!");
      		if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
      			self.listaInscripciones();
      		} if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }

    	}, function () {
    		// Cuando el modal se cierra
    		self.listaInscripciones();
		});
	};

    self.buscarInscripcionPorAlumno = function () {
        self.inscripciones = [];
        InscripcionService.buscarInscripcionesPorAlumno($rootScope.periodo_lectivo._id, self.alumno._id)
            .then(function (response) {
                if(!_.isEmpty(response.data.alumnoInscripciones)){
                    self.inscripciones = response.data.alumnoInscripciones;
                }else{
                    self.showMessage('Posiblemente el alumno no fue inscripto en este periodo, intente buscando en otro periodo', 'info');
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
    }

     self.buscarAlumnoPorDni = function () {
        if(!_.isEmpty(self.dni)){
            AlumnoService.buscarAlumnoPorDni(self.dni)
            .then(function (response) {
                if(!_.isEmpty(response.data.alumnoDni)){
                    self.alumno = response.data.alumnoDni[0];
                    self.buscarInscripcionPorAlumno();
                }else{
                    self.showMessage('El alumno no se encuentra', 'info');
                }
                    
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
        }else{
            self.showMessage('Ingrese el DNI del alumno para buscar.', 'warning');
        }
    };

    self.busquedaAvanzada = function (){
         if(_.isEmpty(self.curso)){
             self.showMessage('Seleccione un curso.', 'info');
         }

         if(_.isEmpty(self.provincia)){
             self.showMessage('Seleccione una provincia.', 'info');
         }

         if(_.isEmpty(self.localidad)){
             self.showMessage('Seleccione una localidad.', 'info');
         }

         if( _.isEmpty($rootScope.periodo_lectivo)){
             self.showMessage('Seleccione un periodo.', 'info');
         }

         if(!_.isEmpty(self.curso) && !_.isEmpty(self.provincia) && !_.isEmpty(self.localidad) && !_.isEmpty($rootScope.periodo_lectivo)){
             self.inscripciones = [];
             var q = query();
             q.curso = self.curso._id;
             q.provincia = self.provincia._id;
             q.localidad = self.localidad._id;
            InscripcionService.buscarInscripciones($rootScope.periodo_lectivo._id, q)
            .then(function (response) {
                if(!_.isEmpty(response.data.inscripciones)){
                    self.inscripciones = response.data.inscripciones;
                }else{
                    self.showMessage('No existen datos de incripciones para esos filtros', 'info');
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
         }
    };

    var query = function () {
        return {
            "curso": "",
            "provincia": "",
            "localidad": ""
        }
    } 


    // Metodo que trae los datos de las provincias
	self.obtenerPronvincias = function () {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
	    	self.provincias = response.data.provincias;
		});
	}

	// Metodo que trae los datos de las localidades
    self.obtenerLocalidades = function () {
        self.localidades = [];
        LocalidadService.obtenerLocalidades().then(function(response){
            self.localidades = response.data.localidades;
        });
    }

	// Metodo que trae los datos de las localidades
    self.onSelectProvincia = function (item) {
        self.localidades = [];
        LocalidadService.obtenerLocalidadesPorProvincia(item._id).then(function(response){
            self.localidades = response.data.localidades;  
        });
    }

    // Metodo que para restablecer los filtros
    self.restarFiltro = function () {
        self.curso = undefined;
        self.provincia = undefined;
        self.localidad = undefined;
        self.listaInscripciones();
    }

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function () {
        // Prepare Excel data:
        self.fileName = "datos-de-inscripciones";
        self.exportData = [];
        // Headers:
        self.exportData.push(["PERIODO LECTIVO","DNI", "ALUMNO", "CURSO", "PROVINCIA", "LOCALIDAD",  "FECHA INSCRIPCION", "DOCUMENTACION"]);
        // Data:
        angular.forEach(self.inscripciones, function (value, key) {
            self.exportData.push([value.periodo.nombre, value.alumno.dni, value.alumno.nombre, value.curso.nombre, value.provincia.nombre, value.localidad.nombre, value.fecinsc, value.estadoc ? "COMPLETA" : "INCOMPLETA"]);
        });
    }

    // Metodo redirige a la pagina que agrega nuevas inscripciones
    self.irInscripciones = function () {
        $state.go('nueva-inscripcion');
    }

    // Metodo para mostrar modal del confirmacion para borrar un curso
    self.borrarOnClick = function (index, id) {
        bootbox.confirm({
            title: "Borrar Curso",
            message: "¿Estas seguro que desea borrar esta inscripción?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> No'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Si'
                }
            },
            callback: function (result) {
                if (result) {
                    InscripcionService.borraInscripcion(id)
                        .then(function (response) {
                            self.listaInscripciones();
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
        if (type == 'error') {
            toastr.error(message);
        }
        if (type == 'success') {
            toastr.success(message);
        }
        if (type == 'warning') {
            toastr.warning(message);
        }
        if (type == 'info') {
            toastr.info(message);
        }
    };

    // Hago la llamada a todos los servicios que traer datos

    self.listaInscripciones();
    self.obtenerCursos();
    self.obtenerPronvincias();
    self.obtenerLocalidades();
};