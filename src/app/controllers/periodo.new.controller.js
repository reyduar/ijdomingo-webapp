angular.module('app').controller('PeriodoModalController', PeriodoModalController);

function PeriodoModalController($log, PeriodoService, $uibModalInstance, $timeout, periodoEdit, toastr) {

    var self = this;

    var init = function () {
        self.mostarMensaje = false;
        self.toggl = false;    
        self.stateEdition = '';
        if(!angular.isUndefined(periodoEdit.id)){
            self.titulo = "Editar Periodo Lectivo";
            self.id = periodoEdit.id;
            self.nombre = periodoEdit.nombre;
            self.descripcion = periodoEdit.descripcion;
        }else{
            self.titulo = "Nuevo Periodo Lectivo";
            self.nombre = '';
            self.descripcion = '';
        }
    };

    self.onClickGuardar = function (){
        if(self.titulo == 'Nuevo Periodo Lectivo'){
            self.guardar();
        }else{
            self.editar();
        }
    };

    // Metodo que guarda los datos del periodo
    self.guardar = function () {
        PeriodoService.guardarPeriodo({ "nombre" : self.nombre, "descripcion" : self.descripcion, "estado": false })
           .then(function (response) {
                self.toggl = true; 
                self.nombre = '';
                self.descripcion = '';
                self.showMessage(response.data.message, 'success');
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
        PeriodoService.editarPeriodo(self.id, { "nombre" : self.nombre, "descripcion" : self.descripcion, "estado": false })
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
