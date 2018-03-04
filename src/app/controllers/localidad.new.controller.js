angular.module('app').controller('LocalidadModalController', LocalidadModalController);

function LocalidadModalController(toastr, $log, ProvinciaService, LocalidadService, $uibModalInstance, $timeout, localidadEdit, $filter, acceso) {

    var self = this;

    var init = function () {
        self.obtenerPronvincias();
        self.mostarMensaje = false;
        self.toggl = false;    
        self.stateEdition = '';
        if(!_.isEmpty(localidadEdit)){
            self.titulo = "Editar Localidad";
            self.id = localidadEdit.id;
            self.nombre = localidadEdit.nombre;
            //$log.warn("localidadEdit.provincia.nombre: " + JSON.stringify(localidadEdit.provincia.nombre));
        }else{
            self.titulo = "Nueva Localidad";
            self.nombre = '';
        }
    }

    // Metodo que trae los datos de las provincias
	self.obtenerPronvincias = function () {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
	    	self.provincias = response.data.provincias;
            self.provincia = !_.isEmpty(localidadEdit) ? $filter('filter')(self.provincias, { nombre: localidadEdit.provincia.nombre })[0] : undefined; 
		});
	}

    self.onClickGuardar = function (){
        if(self.titulo == 'Nueva Localidad'){
            self.guardar();
        }else{
            self.editar();
        }
    }

    // Metodo que guarda los datos de alumnos
    self.guardar = function () {
        LocalidadService.guardarLocalidad({ "nombre" : self.nombre, "provincia": self.provincia })
           .then(function (response) {
                self.toggl = true; 
                self.nombre = '';
                self.provincia = undefined;
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
        LocalidadService.editarLocalidad(self.id, { "nombre" : self.nombre, "provincia": self.provincia })
           .then(function (response) {
                self.toggl = true; 
                self.stateEdition = 'editado';
                self.showMessage(response.data.message, 'success');
                $uibModalInstance.close(self);
           }, function (error) {
                self.toggl = false;
                self.showMessage(error.data.message, 'error');
                self.stateEdition = 'error';
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
        if (type == 'error') {
            toastr.error(message);
        }
        if (type == 'success') {
            toastr.success(message);
        }
        if (type == 'warning') {
            toastr.warning(message);
        }
        if (type == 'info') {
            toastr.info(message);
        }
    }

    init();
}
