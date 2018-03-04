angular.module('app').controller('NotaModalController', NotaModalController);

function NotaModalController($log, NotaService, InscripcionService, CursoService, ProvinciaService, LocalidadService, $uibModalInstance, $timeout, notaEdit, toastr, $rootScope) {

    var self = this;

    self.reset = function(){
        self.curso = undefined;
        self.provincia = undefined;
        self.localidad = undefined;
        self.inscripcion = undefined;
        self.alumno = undefined;
        self.exaparcial = 0;
        self.exafinal = 0;
        self.asistencia = 0;
    }

    var init = function () {
        self.toggl = false;    
        self.edit = false;  
        self.stateEdition = '';
        if(!_.isEmpty(notaEdit)){
            self.edit = true; 
            self.titulo = "Editar Nota";
            self.id = notaEdit._id;
            self.exaparcial = notaEdit.exaparcial;
            self.exafinal = notaEdit.exafinal;
            self.exatotal = self.exaparcial + self.exafinal;
            self.asistencia = notaEdit.asistencia;
        }else{
            self.titulo = "Nueva Nota";
            self.reset();
        }
    };

    // Metodo que genera la lista de cursos
    self.obtenerCursos = function () {
        self.cursos = [];
        CursoService.obtenerCursos().then(function (response) {
            self.cursos = response.data.cursos;
            if(!_.isEmpty(notaEdit)){
                self.curso = _.find(self.cursos, { _id: notaEdit.curso._id });
                $timeout(function () {  self.cursoOnSelect()  }, 2000);
            }
           
        });
    };

    // Metodo que trae los datos de las provincias
	self.obtenerPronvincias = function () {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
            self.provincias = response.data.provincias;
            if(!_.isEmpty(notaEdit))
                self.provincia = _.find(self.provincias, { _id: notaEdit.provincia._id });
		});
	};

	// Metodo que trae los datos de las localidades
    self.obtenerLocalidades = function () {
        self.localidades = [];
        LocalidadService.obtenerLocalidades().then(function(response){
            self.localidades = response.data.localidades;
            if(!_.isEmpty(notaEdit))
                self.localidad = _.find(self.localidades, { _id: notaEdit.localidad._id });
        });
    };

	// Metodo que trae los datos de las localidades
    self.onSelectProvincia = function (item) {
        self.localidades = [];
        LocalidadService.obtenerLocalidadesPorProvincia(item._id).then(function(response){
            self.localidades = response.data.localidades;  
        });
    };

    self.onClickGuardar = function (){
        self.exatotal = self.exaparcial + self.exafinal;
        if(_.isEmpty(notaEdit)){
            self.guardar();
        }else{
            self.editar();
        }
    }

    // Metodo que guarda las notas
    self.guardar = function () {
        var data = {
            "periodo": $rootScope.periodo_lectivo,
            "localidad": self.localidad,
            "inscripcion": self.inscripcion,
            "exaparcial": self.exaparcial,
            "exafinal": self.exafinal,
            "exatotal": self.exatotal,
            "asistencia": self.asistencia
        };
        NotaService.guardarNota(data)
            .then(function (response) {
                self.toggl = true;
                self.reset();
                self.showMessage(response.data.message, 'success');
            }, function (error) {
                self.toggl = false;
                if (error.status == 409) {
                    self.showMessage(error.data.message, 'warning');
                } else {
                    self.showMessage(error.data.message, 'error');
                }
            });
    };

    self.editar = function () {
        var data = {
            "periodo": $rootScope.periodo_lectivo._id,
            "provincia": self.provincia._id,
            "localidad": self.localidad._id,
            "curso": self.curso._id,
            "alumno": self.inscripcion.alumno._id,
            "inscripcion": self.inscripcion._id,
            "exaparcial": self.exaparcial,
            "exafinal": self.exafinal,
            "exatotal": self.exatotal,
            "asistencia": self.asistencia
        };
        NotaService.editarNota(self.id, data)
            .then(function (response) {
                self.toggl = true;
                self.stateEdition = 'editado';
                self.showMessage(response.data.message, 'success');
                $uibModalInstance.close(self);
            }, function (error) {
                self.toggl = false;
                self.stateEdition = 'error';
                self.showMessage(error.data.message, 'error');
                $uibModalInstance.close(self);
            });
    };

    // Metodo que cierra el modal
    self.cerrar = function () {
        $uibModalInstance.close(self);
        //$uibModalInstance.dismiss('cancel');
    }

    var query = function () {
        return {
            "curso": "",
            "provincia": "",
            "localidad": ""
        }
    } 

    self.cursoOnSelect = function (){
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
                   if(!_.isEmpty(notaEdit))
                        self.inscripcion = _.find(self.inscripciones, { _id: notaEdit.inscripcion._id });
               }else{
                   self.showMessage('No existen datos de incripciones para esos filtros', 'info');
               }
           }, function (error) {
               self.showMessage(error.data.message, 'error');
           });
        }
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
    };

    self.obtenerCursos();
    self.obtenerPronvincias();
    self.obtenerLocalidades();

    init();
}
