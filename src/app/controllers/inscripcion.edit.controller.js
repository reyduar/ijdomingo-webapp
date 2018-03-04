angular.module('app').controller('EditarInscripcionController', EditarInscripcionController);
    
function EditarInscripcionController(InscripcionService, LocalidadService, ProvinciaService, CursoService, AlumnoService, PeriodoService, $log, $timeout, toastr, $uibModalInstance, uibDateParser, inscripcionEdit){
  var self = this;
  	self.mostarMensaje = false;
	var __curso_vacio = "Seleccione un curso.";
	var __provincia_vacio = 'Seleccione una provincia.';
	var __localidad_vacio = 'Seleccione una localidad.';
	var __alumno_vacio = 'Seleccione un alumno.';
	self.toggl = false; 

	self.init = function (){
	  	self.curso = undefined;
		self.provincia = undefined;
		self.localidad = undefined;
		self.alumno = undefined;
		if (!_.isEmpty(inscripcionEdit)) {
		    self.obtenerAlumno(inscripcionEdit.alumno);
		    self.obtenerCurso(inscripcionEdit.curso);
		    self.obtenerPronvincia(inscripcionEdit.provincia);
		    self.obtenerLocalidad(inscripcionEdit.localidad);
		    self.obtenerPeriodo(inscripcionEdit.periodo);
    	    self.fecinsc = uibDateParser.parse(inscripcionEdit.fecinsc, "dd/MM/yyyy");
            self.estadoc = inscripcionEdit.estadoc;
        }
	};
	
	self.obtenerAlumno = function (alumno) {
		self.alumnos = [];
		AlumnoService.obtenerAlumnos().then(function(response){
	    	self.alumnos = response.data.alumnos;
            self.alumno = _.find(self.alumnos, { _id: alumno._id });
		});
	};

	self.obtenerPronvincia = function (provincia) {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
	    	self.provincias = response.data.provincias;
            self.provincia = _.find(self.provincias, { _id: provincia._id });
		});
	};

    self.obtenerLocalidad = function (localidad) {
        self.localidades = [];
        LocalidadService.obtenerLocalidades().then(function(response){
            self.localidades = response.data.localidades;
            self.localidad = _.find(self.localidades, { _id: localidad._id });
        });
    };

	self.obtenerCurso = function (curso) {
		self.cursos = [];
		CursoService.obtenerCursos().then(function(response){
	    	self.cursos = response.data.cursos;
            self.curso = _.find(self.cursos, { _id: curso._id });
		});
	};

	self.obtenerPeriodo = function (periodo) {
		self.cursos = [];
		PeriodoService.obtenerPeriodos().then(function(response){
	    	self.periodos = response.data.periodos;
            self.periodo = _.find(self.periodos, { _id: periodo._id });
		});
	};

    self.onSelectProvincia = function (item) {
        self.localidades = [];
        LocalidadService.obtenerLocalidadesPorProvincia(item._id).then(function(response){
            self.localidades = response.data.localidades;  
        });
    };

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

    // Evento click del boton guardar docente
    self.onClickGuardar = function (){
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
    };

    // Metodo que cierra el modal
    self.cerrar = function () {
        $uibModalInstance.close(self);
        //$uibModalInstance.dismiss('cancel');
    }

    // Metodo que llama al endpoint para guardar la inscripcion
    self.guardarInscripcion = function (){
    	var insc = new inscripcionJsonBody();
		insc.alumno = self.alumno;
		insc.curso = self.curso;
		insc.provincia = self.provincia;
		insc.localidad = self.localidad;
		insc.periodo = self.periodo;
    	insc.fecinsc = Date.parse(self.fecinsc).toString('dd/MM/yyyy');
        insc.estadoc = self.estadoc;
        InscripcionService.editarInscripcion(inscripcionEdit._id, insc).then(function (response) {
            self.toggl = true; 
            self.showMessage(response.data.message, 'success');
            $uibModalInstance.close(self);
        }, function (error) {
            self.toggl = false; 
        	self.showMessage(error.data.message, 'error');
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
	
};