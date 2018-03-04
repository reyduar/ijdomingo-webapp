angular.module('app').controller('UsuarioModalController', UsuarioModalController);

function UsuarioModalController($log, UsuarioService, $uibModalInstance, $timeout, toastr) {

    var self = this;

    var init = function () {   
        self.titulo = "Registrar Usuario";
        self.nombre = '';
        self.apellido = '';
        self.username = '';
        self.password = '';
        self.userkey = '';
    };

    self.onClickGuardar = function (){
        if(self.password === self.confirmar){
            self.guardar();
        }else{
            toastr.warning("Las contraseñas son diferentes.");
        }
    };


    // Metodo que guarda los datos del periodo
    self.guardar = function () {
        UsuarioService.guardarUsuario({ 
            "nombre" : self.nombre, 
            "apellido" : self.apellido, 
            "username": self.username, 
            "password": self.password, 
            "userkey": self.userkey
        })
           .then(function (response) {
                self.showMessage(response.data.message, 'success');
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


    // Metodo que cierra el modal
    self.cerrar = function () {
        //$uibModalInstance.close(self);
        $uibModalInstance.dismiss('cancel');
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
