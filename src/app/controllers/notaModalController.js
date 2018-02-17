angular.module('app').controller('NotaModalController', NotaModalController);

function NotaModalController($filter, $log, ApiService, $uibModalInstance, $timeout, notaEdit, cursos) {

    var self = this;

    self.reset = function(){
        self.cursoSeleccionado = undefined;
        self.alumnoSeleccionado = undefined;
        self.exaparcial = 0;
        self.exafinal = 0;
        self.asistencia = 0;
    }

    var init = function () {
        self.inscripciones = [];
        self.cursos = [];
        self.mostarMensaje = false;
        self.toggl = false;    
        self.edit = false;  
        self.stateEdition = '';
        self.cursos = cursos;
        if(!angular.isUndefined(notaEdit)){
            self.edit = true; 
            self.titulo = "Editar Nota";
            self.id = notaEdit._id;
            self.cursoSeleccionado = $filter('filter')(self.cursos, { nombre: notaEdit.curso })[0];
            self.cursoOnSelect(notaEdit.curso);
            self.exaparcial = notaEdit.exaparcial;
            self.exafinal = notaEdit.exafinal;
            self.exatotal = self.exaparcial + self.exafinal;
            self.asistencia = notaEdit.asistencia;
            $timeout(function () {  self.alumnoSeleccionado = $filter('filter')(self.inscripciones, { alumno: notaEdit.alumno })[0];  }, 1000);
        }else{
            self.titulo = "Agregar Nueva Nota";
            self.reset();
        }
    }

    

    self.onClickGuardar = function (){
        self.exatotal = self.exaparcial + self.exafinal;
        if(!self.edit){
            self.guardar();
        }else{
            self.editar();
        }
    }

    // Metodo que guarda las notas
    self.guardar = function () {
        var data = { 
                    "dni": self.alumnoSeleccionado.dni,
                    "alumno": self.alumnoSeleccionado.alumno,
                    "curso": self.cursoSeleccionado.nombre,
                    "exaparcial": self.exaparcial,
                    "exafinal": self.exafinal,
                    "exatotal": self.exatotal,
                    "asistencia": self.asistencia,
                    "periodo": "2017"
                };
        ApiService.guardarNota(data)
           .then(function (response) {
                self.toggl = true; 
                self.reset();
                alerta("__exito_al_guardar");
           }, function (error) {
                self.toggl = false;  
                alerta("__error_al_guardar");
           });
        // En caso de querer cerrar el modal automaticamente         
        // $uibModalInstance.close(self);
        
    };

    self.editar = function () {
         var data = { 
                    "dni": self.alumnoSeleccionado.dni,
                    "alumno": self.alumnoSeleccionado.alumno,
                    "curso": self.cursoSeleccionado.nombre,
                    "exaparcial": self.exaparcial,
                    "exafinal": self.exafinal,
                    "exatotal": self.exatotal,
                    "asistencia": self.asistencia
                };
        ApiService.editarNota(self.id, data)
           .then(function (response) {
                self.toggl = true; 
                self.stateEdition = 'editado';
                $uibModalInstance.close(self);
           }, function (error) {
                self.toggl = false;
                self.stateEdition = 'error';
                $uibModalInstance.close(self);
           });
    };

    // Metodo que cierra el modal
    self.cerrar = function () {
        $uibModalInstance.close(self);
        //$uibModalInstance.dismiss('cancel');
    }

    // Metodo que para filtrar las inscripciones por curso
    self.cursoOnSelect = function (curso) {
       self.cursoNombre = curso;
       self.alumnoSeleccionado = undefined;
       self.buscarInscripcionesPorCurso();
    }

    // Metodo que busca las inscripciones por curso
    self.buscarInscripcionesPorCurso = function () {
        self.inscripciones = [];
        ApiService.buscarInscripcionesPorCurso(self.cursoNombre).then(function(response){
                self.inscripciones = response.data.inscripcionesCurso;
        });
    }

    self.limpiar = function (){
        self.cursoSeleccionado = undefined;
        self.alumnoSeleccionado = undefined;
        self.inscripciones = [];
    }

    // Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_guardar":
                self.alertMsg = "Error al guardar la nota";
                self.alert = 'alert alert-danger alert-dismissible';
                self.alertType = 'Error';
                break;
            case "__exito_al_guardar":
                self.alertMsg = "Nota guardado exitosamente";
                self.alert = 'alert alert-success alert-dismissible';
                self.alertType = 'Exito';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 2000);
    }

    init();
}
