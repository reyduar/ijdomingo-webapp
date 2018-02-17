angular.module('app').controller('EditarInscripcionController', EditarInscripcionController);
    
function EditarInscripcionController(ApiService, $log, $timeout, $state, $filter, uibDateParser, $stateParams){
  
	var self = this;
  	self.mostarMensaje = false;
    self.idInsc = $stateParams.id;
	
	self.sexos = 
            [
                { nombre: "Masculino" },
                { nombre: "Femenino" }
            ];
	

	// Metodo que trae los datos de las provincias
	self.obtenerPronvincias = function () {
		self.provincias = [];
		ApiService.obtenerPronvincias().then(function(response){
	    	self.provincias = response.data;
		});
	}

	// Metodo que trae los datos de las regiones
	self.obtenerRegiones = function () {
		self.regiones = [];
		ApiService.obtenerRegiones().then(function(response){
	    	self.regiones = response.data;
		});
	}

	// Metodo que genera la lista de cursos
	self.listaCursos = function () {
		self.cursos = [];
		ApiService.obtenerCursos().then(function(response){
	    	self.cursos = response.data.curso;
            self.buscarAlumnoYInscripcion();
		});
	}

    // Metodo que buscar el alumno por dni
    self.buscarAlumnoYInscripcion = function () {
        var aluEncontrado = [];
        var insEncontada = [];
        ApiService.buscarInscripcionPorId(self.idInsc).then(function(response){
            insEncontada = response.data.inscripcion;
            ApiService.buscarAlumnoPorDni(insEncontada.dni).then(function(response){
                aluEncontrado = response.data.alumnoDni[0];
                //*Rellenar datos en el formulario*//
                var fecInscripcion = insEncontada.fecinsc;
                self.fecinsc = uibDateParser.parse(fecInscripcion, "dd/MM/yyyy");
                self.estadoc = insEncontada.estadoc;
                self.cursoSeleccionado = $filter('filter')(self.cursos, { nombre: insEncontada.curso })[0];;
                var nac = $filter('filter')(self.regiones, { gentilicio: aluEncontrado.nacionalidad })[0]; 
                var sex = $filter('filter')(self.sexos, { nombre: aluEncontrado.sexo })[0];
                var prov = $filter('filter')(self.provincias, { nombre: aluEncontrado.provincia })[0];
                var fec = aluEncontrado.fecnac;
                var fecha = uibDateParser.parse(fec, "dd/MM/yyyy");
                self.id = aluEncontrado._id;
                self.dni = aluEncontrado.dni;
                self.nombre = aluEncontrado.nombre;
                self.apellido = aluEncontrado.apellido;
                self.nacionalidad = nac;
                self.fecnac = fecha;
                self.sexo = sex;
                self.fijo = aluEncontrado.fijo;
                self.celular = aluEncontrado.celular;
                self.email = aluEncontrado.email;
                self.provincia = prov;
                self.localidad = aluEncontrado.localidad;
                self.domicilio = aluEncontrado.domicilio;
                self.barrio = aluEncontrado.barrio;
                self.ocupacion = aluEncontrado.ocupacion;
            });
        });
    }

	self.datosDelAlumno = function(){
		var fec = Date.parse(self.fecnac).toString('dd/MM/yyyy');
		var alumno = new alumnoJsonBody();
	        alumno.dni = self.dni;
	        alumno.nombre = self.nombre;
	        alumno.apellido = self.apellido;
	        alumno.nacionalidad = self.nacionalidad.gentilicio;
	        alumno.fecnac = fec;
	        alumno.sexo = self.sexo.nombre;
	        alumno.fijo = self.fijo;
	        alumno.celular = self.celular;
	        alumno.email = self.email;
	        alumno.provincia = self.provincia.nombre;
	        alumno.localidad = self.localidad;
            alumno.domicilio = self.domicilio;
            alumno.barrio = self.barrio;
	        alumno.ocupacion = self.ocupacion;
	        return alumno;
	}
	
    // Meotod que guarda los datos de alumnos
    self.editarAlumno = function () {
   		var alumno = self.datosDelAlumno();
       	ApiService.editarAlumno(alumno, self.id).then(function (response) {
			self.guardarInscripcion();
        }, function (error) {
        	$log.error(error)
            alerta("__error_al_guardar");
        });
    }

    // Meotod para el evento submit
    self.enviar = function () {
    	if(angular.isUndefined(self.cursoSeleccionado)){
    		alerta("__curso_vacio");
    	}else{
			if(angular.isUndefined(self.provincia)){
				alerta("__provincia_vacio");
			}else{
				if(angular.isUndefined(self.nacionalidad)){
					alerta("__nacionalidad_vacio");
				}else{
					if(angular.isUndefined(self.sexo)){
						alerta("__sexo_vacio");
					}else{
						self.editando();
						self.editarAlumno();
					}
				}
			}
    	}
    }
    		
    // Metodo que llama al endpoint para guardar la inscripcion
    self.guardarInscripcion = function (){
    	var insc = new inscripcionJsonBody();
    	insc.dni = self.dni;
    	insc.alumno = self.nombre + " " + self.apellido;
    	insc.fecinsc = Date.parse(self.fecinsc).toString('dd/MM/yyyy');
    	insc.curso = self.cursoSeleccionado.nombre;
        insc.estadoc = self.estadoc;
        ApiService.editarInscripcion(self.idInsc, insc).then(function (response) {
            alerta("__exito_al_guardar");
            $timeout(function () { self.irInscripciones(); }, 1000);
        }, function (error) {
        	$log.info(error);
            alerta("__error_al_guardar");
        });
    }

	// Contrato para guardar alumnos
    var inscripcionJsonBody = function () {
        return {
        	"dni" : "",
        	"alumno" : "",
            "fecinsc" : "",
            "curso" : "",
            "estadoc": false,
            "estado": true
        }
    }

    // Contrato para guardar alumnos
    var alumnoJsonBody = function () {
        return {
            "nombre" : "",
            "apellido" : "",
            "nacionalidad" : "",
            "fecnac" : "",
            "dni" : "",
            "sexo" : "",
            "email" : "",
            "fijo" : "",
            "celular" : "",
            "provincia" : "",
            "localidad" : "",
            "domicilio" : "",
            "barrio" : "",
            "ocupacion" : ""
        }
    }

    //Metodo para redirigir la pagina a inscripciones
    self.irInscripciones = function () {
        $state.go('inscripciones');
    }

    // Metodo para manejar los estilos del boton cuando esta enviando la inscripcion
    self.editando = function(){
    	self.colorButton = "btn btn-default btn-lg";
    	self.labelButton = "Guardando Inscripción";
    	self.typeButton = "button";
    	self.iconButton = "fa fa-spinner fa-pulse fa-lg fa-fw";
    }

    // Metodo para manejar los estilos del boton de enviar inscripcion
    self.esperandoEditar = function(){
    	self.colorButton = "btn btn-success btn-lg";
    	self.labelButton = "Guardar Inscripción";
    	self.typeButton = "submit";
    	self.iconButton = "glyphicon glyphicon-floppy-saved";
    }

    // Metodo para traer la fecha local del sistema
    var getDatetime = function() {
    	var fec = Date.parse(new Date()).toString('dd/MM/yyyy');
  		return fec;
	};

	// Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_guardar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Fallo el envio de la inscripción";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_guardar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Inscripción enviada con éxito";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__curso_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione un curso";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__nacionalidad_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione una nacionalidad";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__provincia_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione una provincia";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__sexo_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione un sexo";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__advertencia_ya_inscripto":
                self.icon = 'glyphicon glyphicon-exclamation-sign';
                self.alertMsg = "Usted ya se encuentra inscripto en este curso";
                self.alert = 'alert alert-warning ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

    self.dismissAlert = function() {
        self.mostarMensaje = false;
    };

    self.today = function() {
    	self.fecnac = new Date(1980, 1, 1);
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
    self.esperandoEditar();
	self.listaCursos();
	self.obtenerPronvincias();
	self.obtenerRegiones();
}