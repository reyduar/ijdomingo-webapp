angular.module('app').controller('AsistenciaController', AsistenciaController);
    
function AsistenciaController(ApiService, $log, $uibModal, $timeout, uibDateParser){
  
	var self = this;
  	self.mostarMensaje = false;
    self.alumnoAsitencia = undefined;
    self.cursoSeleccionado = undefined;
	self.dniAlumno = "";
    
    // Metodo que genera la lista de inscripciones
	self.obtenerInscripciones = function () {
		self.inscripciones = [];
		ApiService.buscarInscripciones().then(function(response){
	    	self.inscripciones = response.data.inscripcion;
		});
	}

    // Metodo que genera la lista de cursos
    self.listaCursos = function () {
        self.cursos = [];
        ApiService.obtenerCursos().then(function(response){
            self.cursos = response.data.curso;
        });
    }

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "Lista-Asistencia_"+self.cursoSeleccionado.nombre+"_"+getDatetime();
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", "ALUMNO", "CURSO", "FECHA", "ASISTENCIA"]);
        // Data:
        angular.forEach(self.listaAsistencia, function(value, key) {
            self.exportData.push([value.dni, value.alumno, value.curso, value.fecha, value.asistencia ? "PRESENTE" : "AUSENTE"]);
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
            asistencia.dni = item.dni;
            asistencia.alumno = item.alumno;
            asistencia.fecasis = item.fecha;
            asistencia.curso = item.curso;
            ApiService.guardarAsistencia(asistencia).then(function (response) {
               $log.info("success");
               if(finLista == key + 1){
                    self.obtieneListaAsistencia();
               }
            }, function (error) {
                $log.error(error);
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


        /*angular.forEach(self.listaAsistencia, function (value) {
            self.selectedAll = false;
            if(value._id == item._id){
                if()
            }
        });*/
        
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
        ApiService.editarAsistencia(id, { "estado": newState ? "P" : "A" }).then(function (response) {
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

    // Crea y muestra una lista nueva que no existia en la coleccion de asistencia
    self.generarNuevaLista = function () {
        var nuevaLista = [];
        var inscripcionCurso = [];
        var fechaHoy = fechaCalendario();
        ApiService.buscarInscripcionesPorCurso(self.cursoSeleccionado.nombre).then(function(response){
            if(response.data.inscripcionesCurso.length > 0){
                self.generandoListaAsistenciaEstiloBoton();
                inscripcionCurso = response.data.inscripcionesCurso;
                var finLista = inscripcionCurso.length;
                angular.forEach(inscripcionCurso, function(item, key) {
                    nuevaLista.push({"dni": item.dni, "alumno": item.alumno, "curso": item.curso, "fecha": fechaHoy, "asistencia" : false});
                   if(finLista == key + 1){
                        self.guardarListaDeAsistencia(nuevaLista);
                   }
                });
                
            }else{
                alerta("__no_existe_inscriptos");
            }
        });
    }

    // Actualiza y muestra una lista existente en la coleccion asistencia
    self.obtieneListaAsistencia = function () {
        self.listaAsistencia = [];
        var listaResultado = [];
        var fechaHoy = fechaCalendario();
        ApiService.buscarAsistenciaCursoYFecha(self.cursoSeleccionado.nombre, fechaHoy).then(function(response){
            if(response.data.asistenciaCursoFecha.length > 0){
                listaResultado = response.data.asistenciaCursoFecha;
                var finLista = listaResultado.length;
                angular.forEach(listaResultado, function(item, key) {
                    var asis = item.estado == "P" ? true : false;
                    self.listaAsistencia.push({"_id": item._id, "dni": item.dni, "alumno": item.alumno, "curso": item.curso, "fecha": item.fecasis, "asistencia" : asis });
                    if(finLista == key+1){
                        self.generarListaAsistenciaEstiloBoton();
                        self.exportarEXcel();
                    }
                });
                //$log.info("Entro para generar la lista : "+finLista +" key:"+ (key+1) + "Esta es la lista : " + JSON.stringify(nuevaLista));
            }
        });
    }

    // Muestra una lista existente y si no existe la crea
    self.verListaAsistencia = function () {
        if(!angular.isUndefined(self.cursoSeleccionado)){
            var fechaHoy = fechaCalendario();
            ApiService.buscarAsistenciaCursoYFecha(self.cursoSeleccionado.nombre, fechaHoy)
            .then(function (response) {
                if(response.data.asistenciaCursoFecha.length > 0){
                    self.obtieneListaAsistencia();
                }else{
                    self.alertaConfirmacionParaCrearNuevaLista();
                }
            }, function (error) {
                $log.info(error);
            });
        }else{
            alerta("__advertencia_empty_curso");
        }
    }

    // Metodo que limpiar y deshacer la list
    self.limpiar = function () {
        self.cursoSeleccionado = undefined;
        self.listaAsistencia = [];
        self.exportData = [];
        self.generarListaAsistenciaEstiloBoton();
    }

    // Contrato para guardar asitencia
    var asistenciaJsonBody = function () {
        return {
            "dni" : "",
            "alumno" : "",
            "fecasis" : "",
            "curso" : "",
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

    // Metodo para manejar los estilos del boton cuando esta enviando la inscripcion
    self.generandoListaAsistenciaEstiloBoton = function(){
        self.colorButton = "btn btn-default btn-lg";
        self.labelButton = "Cargando Lista de Asistencia";
        self.iconButton = "fa fa-spinner fa-pulse fa-lg fa-fw";
    }

    // Metodo para manejar los estilos del boton de enviar inscripcion
    self.generarListaAsistenciaEstiloBoton = function(){
        self.colorButton = "btn btn-success btn-lg";
        self.labelButton = "Ver Lista de Asistencia";
        self.iconButton = "glyphicon glyphicon-check";
    }

	// Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__advertencia_empty_curso":
                self.icon = 'glyphicon glyphicon-exclamation-sign';
                self.alertMsg = "Necesita seleccionar un curso para generar la lista de asistencia.";
                self.alert = 'alert alert-warning ui-notification';
                break;
            case "__advertencia_ya_asistencia":
                self.icon = 'glyphicon glyphicon-exclamation-sign';
                self.alertMsg = "La asistencia para este alumno ya fue registrada.";
                self.alert = 'alert alert-warning ui-notification';
                break;
            case "__exito_al_guardar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "La asistencia se registro con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_guardar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al registrar la asistencia, vuelva a intentarlo nuevamente.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__asistencia_vacia":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Debe seleccionar un curso para registrar la asistencia.";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__no_existe_inscriptos":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "No se puede mostrar la lista porque el curso seleccionado no presenta alumnos inscriptos.";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__no_existe_inscriptos":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "No hay ninguna lista de asistencia para exportar a una planilla Excel.";
                self.alert = 'alert alert-info ui-notification';
                break;

                __exportar_empty_lista
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

    // Metodo para traer la fecha local del sistema
    var getDatetime = function() {
        var fec = Date.parse(new Date()).toString('dd-MM-yyyy');
        return fec;
    };

  	// Hago la llamada a todos los servicios que traer datos
	self.obtenerInscripciones();
    self.listaCursos();
    self.generarListaAsistenciaEstiloBoton();
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