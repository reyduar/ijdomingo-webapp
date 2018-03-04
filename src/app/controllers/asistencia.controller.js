angular.module('app').controller('AsistenciaController', AsistenciaController);
    
function AsistenciaController(AsistenciaService, InscripcionService, CursoService, LocalidadService, ProvinciaService, $rootScope, $log, $uibModal, $timeout, uibDateParser, toastr){
  
	var self = this;
    self.alumnoAsitencia = undefined;
    self.curso = undefined;
    self.provincia = undefined;
    self.localidad = undefined;
	self.dniAlumno = "";
    
    var __curso_vacio = "Seleccione un curso.";
	var __provincia_vacio = 'Seleccione una provincia.';
    var __localidad_vacio = 'Seleccione una localidad.';
    var __no_existe_inscriptos = 'No se puede mostrar la lista porque el curso seleccionado no presenta alumnos inscriptos.';

    
    // Metodo que genera la lista de inscripciones
	self.obtenerInscripciones = function () {
		self.inscripciones = [];
		InscripcionService.buscarInscripciones().then(function(response){
	    	self.inscripciones = response.data.inscripciones;
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

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "Lista-Asistencia_"+self.curso.nombre+"_"+getDatetime();
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", "ALUMNO", "CURSO", "FECHA", "ASISTENCIA"]);
        // Data:
        angular.forEach(self.listaAsistencia, function(value, key) {
            self.exportData.push([value.alumno.dni, value.alumno.nombre +" "+value.alumno.apellido, value.curso.nombre, value.fecha, value.asistencia ? "PRESENTE" : "AUSENTE"]);
        });
    }

    self.today = function() {
        self.fecasis = new Date();
    };

    self.open = function() {
        self.popup.opened = true;
    };

    self.popup = {
        opened: false
    };

    self.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date(),
        minDate: new Date(2016, 1, 1),
        startingDay: 1
    };

    self.altInputFormats = ['M!/d!/yyyy'];

    self.today();

    // Metodo que guarda la asistencia
    self.guardarListaDeAsistencia = function (nuevaLista){
        var finLista = nuevaLista.length;
        angular.forEach(nuevaLista, function(item, key) {
            var asistencia = new asistenciaJsonBody();
            asistencia.periodo = item.periodo;
            asistencia.alumno = item.alumno;
            asistencia.fecasis = item.fecha;
            asistencia.periodo = item.periodo;
            asistencia.provincia = item.provincia;
            asistencia.localidad = item.localidad;
            asistencia.curso = item.curso;
            AsistenciaService.guardarAsistencia(asistencia).then(function (response) {
                self.showMessage(response.data.message, 'success');
               if(finLista == key + 1){
                    self.obtieneListaAsistencia();
               }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
        });
        
    }


	// Modal para confirmar si se quiere crear la nueva lista
    self.alertaConfirmacionParaCrearNuevaLista = function() {
            bootbox.confirm({
                title: "Crear Lista de Asistencia",
                message: "¿Estas seguro que desea crear esta lista de asistencia?",
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
                      self.generarNuevaLista();
                    }
                }
            });
    }

    // Metodo click para el boton de ver lista
    self.verListaOnClick = function() {
        self.verListaAsistencia();
    }

     // Metodo click para el boton de ver lista
    self.exportarExcelOnClick = function() {
        self.verListaAsistencia();
    }

    // Selecciona un item y actualiza el estado en la lista de asistencia
    self.checkboxSelected = function (index, item) {
        $log.info("index :"+index +"item"+ JSON.stringify(item));
        var checked = false;
        if(item.asistencia){
            self.listaAsistencia[index].asistencia = false;
            checked = false;
        }else{
            self.listaAsistencia[index].asistencia = true;
            checked = true;
        }
        self.actualizaDatosAsitencia(item._id, checked);
        
    }

    // Seleccionamos toda la lista y actualizamos los datos en la coleccion de asistencia
    self.checkAll = function () {
       if (self.selectedAll) {
            self.selectedAll = true;
        } else {
            self.selectedAll = false;
        }
        angular.forEach(self.listaAsistencia, function (item) {
            item.asistencia = self.selectedAll;
            self.actualizaDatosAsitencia(item._id,item.asistencia);
        });
    }

   
    // Actualiza los datos de una lista existente
    self.actualizaDatosAsitencia = function (id, newState){
        AsistenciaService.editarAsistencia(id, { "estado": newState ? "P" : "A" }).then(function (response) {
            $log.info("success");
            if(self.dniAlumno.length > 0){
               self.dniAlumno = "";
               self.obtieneListaAsistencia();
            }else{
                self.exportarEXcel();
            }
        }, function (error) {
            $log.error(error);
        });
    }

    
    var queryInscripcion = function () {
        return {
            "curso": "",
            "provincia": "",
            "localidad": ""
        }
    } 

    // Crea y muestra una lista nueva que no existia en la coleccion de asistencia
    self.generarNuevaLista = function () {
        var nuevaLista = [];
        var inscripcionCurso = [];
        var fechaHoy = fechaCalendario();
        var q = queryInscripcion();
        q.curso = self.curso._id;
        q.provincia = self.provincia._id;
        q.localidad = self.localidad._id;
        InscripcionService.buscarInscripciones($rootScope.periodo_lectivo._id, q).then(function (response) {
            if (!_.isEmpty(response.data.inscripciones)) {
                inscripcionCurso = response.data.inscripciones;
                var finLista = inscripcionCurso.length;
                angular.forEach(inscripcionCurso, function (item, key) {
                    nuevaLista.push({ 
                        "periodo": item.periodo, 
                        "alumno": item.alumno, 
                        "curso": item.curso,
                        "localidad": item.localidad,
                        "provincia": item.provincia, 
                        "fecha": fechaHoy, 
                        "asistencia": false });
                    if (finLista == key + 1) {
                        self.guardarListaDeAsistencia(nuevaLista);
                    }
                });

            } else {
                self.showMessage(__no_existe_inscriptos, 'warning');
            }
        });
    }

    // Actualiza y muestra una lista existente en la coleccion asistencia
    self.obtieneListaAsistencia = function () {
        self.listaAsistencia = [];
        var listaResultado = [];
        var fechaHoy = fechaCalendario();
        var q = queryAsistencias();
        q.curso = self.curso._id;
        q.provincia = self.provincia._id;
        q.localidad = self.localidad._id;
        q.fecha = fechaCalendario();
        
        AsistenciaService.buscarAsistenciaPorFecha($rootScope.periodo_lectivo._id, q)
        .then(function(response){
            if(!_.isEmpty(response.data.asistencias)){
                listaResultado = response.data.asistencias;
                var finLista = listaResultado.length;
                angular.forEach(listaResultado, function(item, key) {
                    var asis = item.estado == "P" ? true : false;
                    self.listaAsistencia.push({"_id": item._id, "dni": item.alumno.dni, "alumno": item.alumno.nombre + " " + item.alumno.apellido, "curso": item.curso.nombre, "fecha": item.fecasis, "asistencia" : asis });
                    if(finLista == key+1){
                        self.exportarEXcel();
                    }
                });
                //$log.info("Entro para generar la lista : "+finLista +" key:"+ (key+1) + "Esta es la lista : " + JSON.stringify(nuevaLista));
            }
        });
    }

    var queryAsistencias = function () {
        return {
            "curso": "",
            "provincia": "",
            "localidad": "",
            "fecha": "",
        }
    } 

    // Muestra una lista existente y si no existe la crea
    self.verListaAsistencia = function () {
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
            var q = queryAsistencias();
            q.curso = self.curso._id;
            q.provincia = self.provincia._id;
            q.localidad = self.localidad._id;
            q.fecha = fechaCalendario();
            self.listaAsistencia = [];
            AsistenciaService.buscarAsistenciaPorFecha($rootScope.periodo_lectivo._id, q)
            .then(function (response) {
                if(!_.isEmpty(response.data.asistencias)){
                    var listaResultado = response.data.asistencias;
                    var finLista = listaResultado.length;
                    angular.forEach(listaResultado, function(item, key) {
                    var asis = item.estado == "P" ? true : false;
                    self.listaAsistencia.push({"_id": item._id, "dni": item.alumno.dni, "alumno": item.alumno.nombre + " " + item.alumno.apellido, "curso": item.curso.nombre, "fecha": item.fecasis, "asistencia" : asis });
                    if(finLista == key+1){
                        self.exportarEXcel();
                    }
                });
                }else{
                    self.alertaConfirmacionParaCrearNuevaLista();
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
        }else{
            self.showMessage(__advertencia_empty_curso, 'info');
        }
    }

    // Metodo que limpiar y deshacer la list
    self.limpiar = function () {
        self.cursoSeleccionado = undefined;
        self.listaAsistencia = [];
        self.exportData = [];
    }

    // Contrato para guardar asitencia
    var asistenciaJsonBody = function () {
        return {
            "periodo" : null,
            "alumno" : null,
            "curso" : null,
            "provincia" : null,
            "localidad" : null,
            "fecasis" : null,
            "estado": "A"
        }
    }

     // Metodo para traer la fecha local del sistema
    var fechaActual = function() {
        var fec = Date.parse(new Date()).toString('dd/MM/yyyy');
        return fec;
    };

     // Metodo para traer la fecha seleccionada en el calendario
    var fechaCalendario = function() {
        if(self.fecasis == "" || angular.isUndefined(self.fecasis)){
            self.today();    
        }
        return Date.parse(self.fecasis).toString('dd/MM/yyyy');
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

    // Metodo para traer la fecha local del sistema
    var getDatetime = function() {
        var fec = Date.parse(new Date()).toString('dd-MM-yyyy');
        return fec;
    };

  	// Hago la llamada a todos los servicios que traer datos
	//self.obtenerInscripciones();
    self.obtenerCursos();
    self.obtenerPronvincias();
    self.obtenerLocalidades();
}

/* Filter to dni del alumno */
angular.module('app').filter('searchAsistenciaForDni', function () {
    return function (arr, dniAlumno) {
        if (!dniAlumno) {
            return arr;
        }
        var result = [];
        dniAlumno = dniAlumno;
        angular.forEach(arr, function (item) {
            if (item.dni.indexOf(dniAlumno) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});