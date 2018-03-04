angular.module('app').controller('NavController', NavController);
    
function NavController($log, AuthService, $rootScope, $timeout, $state){
  
	var self = this;

	self.viewSideBar = $rootScope.hasPermission;
	
	$rootScope.$watch('hasPermission', function() {
		$timeout(function () {
			self.viewSideBar = $rootScope.hasPermission;
		}, 1000);
	});

    self.cerrarSesion = function () {
		AuthService.logout();
		$timeout(function () {
			$state.go('login');
		}, 1000);
    }
}