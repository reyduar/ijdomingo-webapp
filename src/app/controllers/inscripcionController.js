angular.module('app').controller('InscripcionController', InscripcionController);
    
function InscripcionController(ApiService, $log, $uibModal, $timeout, $state){
  
	var self = this;
  	self.mostarMensaje = false;
    self.cursoSeleccionado = undefined;
	
	// Metodo que genera la lista de inscripciones
	self.listaInscripciones = function () {
		self.inscripciones = [];
        if(angular.isUndefined(self.cursoSeleccionado)){
            ApiService.buscarInscripciones().then(function(response){
                self.inscripciones = response.data.inscripcion;
                self.exportarEXcel();
            });
        }else{
            ApiService.buscarInscripcionesPorCurso(self.filerbyCurso).then(function(response){
                self.inscripciones = response.data.inscripcionesCurso;
                $log.info(JSON.stringify(self.inscripciones));
                self.exportarEXcel();
            });
        }
		
	}
    
    self.restarFiltro = function (){
        self.cursoSeleccionado = undefined;
        self.listaInscripciones();
    }

    // Metodo que genera la lista de cursos
    self.listaCursos = function () {
        self.cursos = [];
        ApiService.obtenerCursos().then(function(response){
            self.cursos = response.data.curso;
        });
    }

    // Metodo que para restablecer los filtros
    self.restarFiltro = function (){
        self.cursoSeleccionado = undefined;
        self.listaInscripciones();
    }

    // Metodo que para filtrar por curso las inscripciones
    self.filterPorCurso = function (curso) {
        self.filerbyCurso = curso;
       self.listaInscripciones();
    }

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-inscripciones";
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", "ALUMNO", "CURSO", "FECHA INSCRIPCION", "DOCUMENTACION"]);
        // Data:
        angular.forEach(self.inscripciones, function(value, key) {
            self.exportData.push([value.dni, value.alumno, value.curso, value.fecinsc, value.estadoc ? "COMPLETA" : "INCOMPLETA"]);
        });
    }

	// Metodo redirige a la pagina que agrega nuevas inscripciones
	self.irInscripciones = function () {
        $state.go('home');
	}

    // Metodo para mostrar modal del confirmacion para borrar un curso
    self.borrarOnClick = function(index, id) {
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
                if(result){
                    ApiService.borraInscripcion(id)
                    .then(function (response) {
                        self.listaInscripciones();
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
                self.alertMsg = "Error al borrar la inscripción.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_borrar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Inscripción borrada con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__exito_al_editar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Inscripción editada con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_editar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al editar la inscripción.";
                self.alert = 'alert alert-danger ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

  	// Hago la llamada a todos los servicios que traer datos
	self.listaInscripciones();
    self.listaCursos();
}

/* Filter to dni del alumno */
angular.module('app').filter('searchForDni', function () {
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