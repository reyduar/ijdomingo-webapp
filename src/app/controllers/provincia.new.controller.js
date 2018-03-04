angular.module('app').controller('ProvinciaModalController', ProvinciaModalController);

function ProvinciaModalController($log, ProvinciaService, $uibModalInstance, $timeout, provinciaEdit, toastr, acceso) {

    var self = this;

    var init = function () {
        self.mostarMensaje = false;
        self.toggl = false;    
        self.stateEdition = '';
        if(!_.isEmpty(provinciaEdit)){
            self.titulo = "Editar Provincia";
            self.id = provinciaEdit.id;
            self.nombre = provinciaEdit.nombre;
        }else{
            self.titulo = "Nueva Provincia";
            self.nombre = '';
        }
    }

    self.onClickGuardar = function (){
        if(self.titulo == 'Nueva Provincia'){
            self.guardar();
        }else{
            self.editar();
        }
    }

    // Metodo que guarda los datos de alumnos
    self.guardar = function () {
        ProvinciaService.guardarProvincia({ "nombre" : self.nombre })
           .then(function (response) {
                self.toggl = true; 
                self.nombre = '';
                self.showMessage(response.data.message, 'success');
                if (_.includes(acceso, 'inscripciones'))
                    $uibModalInstance.close(self);
           }, function (error) {
                self.toggl = false;  
                if(error.status == 409){
                    self.showMessage(error.data.message, 'warning');
                }else{
                    self.showMessage(error.data.message, 'error');
                }
           });
        // En caso de querer cerrar el modal automaticamente         
        // $uibModalInstance.close(self);
        
    };

    self.editar = function () {
        ProvinciaService.editarProvincia(self.id, { "nombre" : self.nombre })
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
    }

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
    }

    init();
}
