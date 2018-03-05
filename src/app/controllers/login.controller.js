angular.module('app').controller('LoginController', LoginController);

function LoginController($localStorage,  $state, AuthService, $uibModal, toastr, $log, $rootScope) {

    var self = this;
    
    var init = function(){
         if(!_.isEmpty($localStorage.sesion)){
            self.rememberme = $localStorage.sesion.rememberme;
            self.username = $localStorage.sesion.username;
            self.password = $localStorage.sesion.password;
         }else{
            $localStorage.sesion = {};
         }
    };

    self.login = function () {
        AuthService.login({ "username": self.username, "password": self.password })
            .then(function (response) {
                if(!_.isEmpty(response.data.usuario)){
                    $rootScope.hasPermission = true;
                    $localStorage.usuario = response.data.usuario.username;
                    self.gettoken();
                    self.recordarme();
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
    };

    self.gettoken = function () {
        AuthService.login({ "username": self.username, "password": self.password, "gettoken": true })
            .then(function (response) {
                if(!_.isEmpty(response.data.token)){
                    $localStorage.token = response.data.token; 
                    $state.go('nueva-inscripcion', { reload: true, notify: true });
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
    }

    self.recordarme = function () {
        if(self.rememberme)
            $localStorage.sesion = { "username": self.username, "password": self.password, "rememberme": true };
        else
            $localStorage.sesion = {}
    };

    // Metodo que llama al modal de agregar alumnos
	self.registrarUsuario = function () {
		var modalInstance = $uibModal.open({
		    controller: 'UsuarioModalController',
		    controllerAs: 'usuModalCtrl',
		    templateUrl: 'app/controllers/usuario.new.html',
		    size: 'md'
		});
		modalInstance.result.then(function (result) {
            if(!_.isEmpty(result)){
                self.username = result.username;
                self.password = result.password;
            }	
    	});
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
