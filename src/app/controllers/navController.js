angular.module('app').controller('NavController', NavController);
    
function NavController($log, $uibModal){
  
	var self = this;

	self.user = true;
	// Metodo que llama al modal de login
	self.mostrarLoginModal = function () {
		var modalInstance = $uibModal.open({
		    controller: 'LoginController',
		    controllerAs: 'lgCtrl',
		    templateUrl: 'app/views/login.html',
		    size: 'sm'
		});

		modalInstance.result.then(function (result) {
      		// Cuando el modal retorna resultados
    	}, function () {
    		// Cuando el modal se cierra
		});
	}
}