angular.module('app').controller('NotaController', NotaController);
    
function NotaController(ApiService, $log, $uibModal, $timeout, $state){
  
	var self = this;
  	self.mostarMensaje = false;
    self.cursoSeleccionado = undefined;
	
	// Metodo que genera la lista de notas
	self.listaNotas = function () {
		self.notas = [];
        if(angular.isUndefined(self.cursoSeleccionado)){
            ApiService.obtenerNotas().then(function(response){
                self.notas = response.data.notas;
                self.exportarEXcel();
            });
        }else{
            ApiService.buscarNotasPorCurso(self.filerbyCurso).then(function(response){
                self.notas = response.data.notaCurso;
                self.exportarEXcel();
            });
        }
	}
    
    self.restarFiltro = function (){
        self.cursoSeleccionado = undefined;
        self.listaNotas();
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
        self.listaNotas();
    }

    // Metodo que para filtrar por curso las notas
    self.filterPorCurso = function (curso) {
        self.filerbyCurso = curso;
       self.listaNotas();
    }

    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-notas";
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", "ALUMNO", "CURSO", "EXAMEN PARCIAL", "EXAMEN FINAL", "TOTAL", "ASISTENCIA(%)"]);
        // Data:
        angular.forEach(self.notas, function(value, key) {
            self.exportData.push([value.dni, value.alumno, value.curso, value.exaparcial, value.exafinal, value.exatotal, value.asistencia]);
        });
    }

	// Metodo que llama al modal de agregar alumnos
    self.agregarNota = function (nota) {
        var modalInstance = $uibModal.open({
            controller: 'NotaModalController',
            controllerAs: 'notaModalCtrl',
            templateUrl: 'app/views/notaModal.html',
            size: 'lg',
            resolve: {
                notaEdit: function () {
                    return nota;
                },
                cursos: function () {
                    return self.cursos;
                },
            }
        });

        modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.listaNotas() : $log.log("Nothing to do!");
            if(resultado.stateEdition == 'editado'){
                alerta("__exito_al_editar");
                self.listaNotas()
            } if(resultado.stateEdition == 'error'){
                alerta("__error_al_editar");
            }
            
        }, function () {
            // Cuando el modal se cierra
            self.listaNotas();
        });
    }

    // Metodo para mostrar modal del confirmacion para borrar un curso
    self.borrarOnClick = function(index, nota) {
        bootbox.confirm({
            title: "Borrar Nota",
            message: "¿Estas seguro que desea borrar la nota de "+ nota.alumno +"?",
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
                    ApiService.borrarNota(nota._id)
                    .then(function (response) {
                        self.listaNotas();
                        alerta("__exito_al_borrar");
                    }, function (error) {
                        alerta("__error_al_borrar");
                    });
                }
            }
        });
    };

    self.verOnClick = function(item){
        var nota = '';
        nota += '<pre>';
        nota += '<em>DNI: </em>'+ item.dni;
        nota += '<br ><em>Alumno: </em>'+ item.alumno;
        nota += '<br ><em>Curso: </em>'+ item.curso;
        nota += '<br ><em>Asistencia : </em>'+ item.asistencia + '%';
        nota += '<br ><em>Examen Parcial: </em>'+ item.exaparcial;
        nota += '<br ><em>Examen Final: </em>'+ item.exafinal;
        nota += '<br ><em>Total de Puntos: </em>'+ item.exatotal;
        nota += '</pre>';
        bootbox.alert({
            title: "Nota",
            message: nota
        });
    }

	// Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_borrar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al borrar la nota.";
                self.alert = 'alert alert-danger ui-notification';
                break;
            case "__exito_al_borrar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Nota borrada con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__exito_al_editar":
                self.icon = 'glyphicon glyphicon-ok-sign';
                self.alertMsg = "Nota editada con éxito.";
                self.alert = 'alert alert-success ui-notification';
                break;
            case "__error_al_editar":
                self.icon = 'glyphicon glyphicon-remove-sign';
                self.alertMsg = "Error al editar la nota.";
                self.alert = 'alert alert-danger ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 5000);
    }

  	// Hago la llamada a todos los servicios que traer datos
	self.listaNotas();
    self.listaCursos();
}

/* Filter to dni del alumno */
angular.module('app').filter('filtroNotaDni', function () {
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