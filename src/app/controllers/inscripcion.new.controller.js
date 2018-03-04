angular.module('app').controller('HomeController', HomeController);
    
function HomeController(InscripcionService, LocalidadService, ProvinciaService, CursoService, AlumnoService, $log, $uibModal, $timeout, $filter, uibDateParser, toastr, $rootScope, $scope){
  
	var self = this;
  	self.mostarMensaje = false;
	var __curso_vacio = "Seleccione un curso.";
	var __provincia_vacio = 'Seleccione una provincia.';
	var __localidad_vacio = 'Seleccione una localidad.';
	var __alumno_vacio = 'Seleccione un alumno.';
	
	self.init = function (){
	  	self.botonHabilitado();
	  	self.curso = undefined;
		self.provincia = undefined;
		self.localidad = undefined;
		self.alumno = undefined;
		self.estadoc = false;
	}
	
	// Metodo que genera la lista de alumnos
	self.obtenerAlumnos = function () {
		self.alumnos = [];
		AlumnoService.obtenerAlumnos().then(function(response){
	    	self.alumnos = response.data.alumnos;
	    	//$log.warn("Alumnos: " + JSON.stringify(self.alumnos));
		});
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

	// Metodo que genera la lista de cursos
	self.obtenerCursos = function () {
		self.cursos = [];
		CursoService.obtenerCursos().then(function(response){
	    	self.cursos = response.data.cursos;
	    	//$log.warn("Cursos: " + JSON.stringify(self.cursos));
		});
	}

	// Metodo que llama al modal de agregar alumnos
	self.nuevoAlumno = function () {
		var alumno = undefined;
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
                    return "inscripciones";
                }
            }
		});
		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.obtenerAlumnos() : $log.log("Nothing to do!");
    	}, function () {});
	}

	// Metodo que llama al modal de nuevo curso
	self.nuevoCurso = function () {
		var curso = undefined;
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
                    return "inscripciones";
                }
            }
		});
		modalInstance.result.then(function (resultado) {
			resultado.toggl ? self.obtenerCursos() : $log.log("Nothing to do!");
    	}, function () {});
	};

	// Metodo que llama al modal de nueva localidad
	self.nuevaLocalidad = function () {
        var localidad = undefined;
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
                    return "inscripciones";
                }
            }
		});
		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.obtenerLocalidades() : $log.log("Nothing to do!");
    	}, function () {});
	}

	// Metodo que llama al modal de nuevo provincia
	self.nuevaProvincia = function () {
        var provincia = undefined;
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
                    return "inscripciones";
                }
            }
		});
		modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.obtenerPronvincias() : $log.log("Nothing to do!");
    	}, function () {});
	}


    // Meotod para el evento submit
    self.enviar = function () {
    	if(angular.isUndefined(self.curso)){
			self.showMessage(__curso_vacio, 'info');
    	}else{
			if(angular.isUndefined(self.provincia)){
				self.showMessage(__provincia_vacio, 'info');
			}else{
				if(angular.isUndefined(self.localidad)){
					self.showMessage(__localidad_vacio, 'info');
				}else{
					if(angular.isUndefined(self.alumno)){
						self.showMessage(__alumno_vacio, 'info');
					}else{
						self.guardarInscripcion();
					}
				}
			}
    	}
    }

    // Metodo que llama al endpoint para guardar la inscripcion
    self.guardarInscripcion = function (){
		self.botonDeshabilitado();
    	var insc = new inscripcionJsonBody();
		insc.alumno = self.alumno;
		insc.curso = self.curso;
		insc.provincia = self.provincia;
		insc.localidad = self.localidad;
		insc.periodo = $rootScope.periodo_lectivo;
    	insc.fecinsc = Date.parse(self.fecinsc).toString('dd/MM/yyyy');
        insc.estadoc = self.estadoc;
        InscripcionService.guardarInscripcion(insc).then(function (response) {
            self.showMessage(response.data.message, 'success');
            self.init();
        }, function (error) {
        	if(error.status == 409){
                self.showMessage(error.data.message, 'warning');
            }else{
                self.showMessage(error.data.message, 'error');
			}
			self.botonHabilitado();
        });
    }

	// Contrato para guardar alumnos
    var inscripcionJsonBody = function () {
        return {
			"alumno" : "",
			"curso" : "",
			"provincia" : "",
			"localidad" : "",
			"periodo" : "",
            "fecinsc" : "",
			"estadoc": false,
            "estado": true
        }
    }

    // Metodo para manejar los estilos del boton cuando esta guardando la inscripcion
    self.botonDeshabilitado = function(){
    	self.colorButton = "btn btn-default btn-lg";
    	self.labelButton = "Guardando Inscripción";
    	self.typeButton = "button";
    	self.iconButton = "fa fa-spinner fa-pulse fa-lg fa-fw";
    }

    // Metodo para manejar los estilos del boton de guardar inscripcion
    self.botonHabilitado = function(){
    	self.colorButton = "btn btn-primary btn-lg";
    	self.labelButton = "Guardar Inscripción";
    	self.typeButton = "submit";
    	self.iconButton = "glyphicon glyphicon-floppy-disk";
    }

    // Metodo para traer la fecha local del sistema
    var getDatetime = function() {
    	var fec = Date.parse(new Date()).toString('dd/MM/yyyy');
  		return fec;
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

    self.today = function() {
    	self.fecnac = new Date(1980, 1, 1);
        self.fecinsc = new Date();
  	};

  	self.today();

    self.open1 = function() {
        self.popup1.opened = true;
    };

    self.open2 = function() {
        self.popup2.opened = true;
    };

    self.popup1 = {
        opened: false
    };

     self.popup2 = {
        opened: false
    };

    self.dateOptions = {
	    formatYear: 'yyyy',
	    maxDate: new Date(),
	    minDate: new Date(1900, 1, 1),
	    startingDay: 1
  	};

  	self.altInputFormats = ['M!/d!/yyyy'];

  	// Hago la llamada a todos los servicios que traer datos
	self.init();
	self.obtenerCursos();
	self.obtenerPronvincias();
	self.obtenerLocalidades();
	self.obtenerAlumnos();
	
}