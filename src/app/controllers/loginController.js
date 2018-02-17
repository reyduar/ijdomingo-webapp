angular.module('app').controller('LoginController', LoginController);

function LoginController($uibModalInstance) {

    var self = this;

    // Metodo para boton de login
    self.login = function () {
        $uibModalInstance.close(self);
    }

    // Metodo que cierra el modal
    self.cerrar = function () {
        $uibModalInstance.dismiss('cancel');
    }
}
