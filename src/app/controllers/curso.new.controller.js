angular.module('app').controller('CursoModalController', CursoModalController);

function CursoModalController($log, CursoService, $uibModalInstance, $timeout, cursoEdit, toastr, acceso) {

    var self = this;
    
    var init = function () {
        self.mostarMensaje = false;
        self.toggl = false;    
        self.stateEdition = '';
        if(!_.isEmpty(cursoEdit)){
            self.titulo = "Editar Curso";
            self.id = cursoEdit._id;
            self.nombre = cursoEdit.nombre;
        }else{
            self.titulo = "Nuevo Curso";
            self.nombre = '';
        }
    };

    self.onClickGuardar = function () {
        if (self.titulo == 'Nuevo Curso') {
            self.guardar();
        } else {
            self.editar();
        }
    };

    // Metodo que guarda los datos de alumnos
    self.guardar = function () {
        CursoService.guardarCurso({ "nombre": self.nombre })
            .then(function (response) {
                self.toggl = true;
                self.nombre = '';
                self.showMessage(response.data.message, 'success');
                if (_.includes(acceso, 'inscripciones'))
                    $uibModalInstance.close(self);
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
        CursoService.editarCurso(self.id, { "nombre": self.nombre })
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

    init();
}
