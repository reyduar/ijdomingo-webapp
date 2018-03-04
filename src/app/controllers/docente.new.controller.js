angular.module('app').controller('DocenteModalController', DocenteModalController);

function DocenteModalController(toastr, LocalidadService, ProvinciaService, NacionalidadService, DocenteService, $uibModalInstance, $timeout, docenteEdit, uibDateParser, $filter, $log) {

    var self = this;
    self.mostarMensaje = false;
    self.toggl = false;    
    self.sexos = [ { nombre: "Masculino" }, { nombre: "Femenino" } ];
    var __facnac_vacio = 'Ingrese una fecha de nacimiento válida.';
    var __sexo_vacio = 'Seleccione un sexo.';
    var __provincia_vacio = 'Seleccione una provincia.';
    var __nacionalidad_vacio = 'Seleccione una nacionalidad.';
    self.init = function (){
        self.guardarDocenteBtn();
        self.stateEdition = '';
        if(!angular.isUndefined(docenteEdit)){
            self.titulo = "Editar Docente";
            self.id = docenteEdit._id;
            self.dni = docenteEdit.dni;
            self.nombre = docenteEdit.nombre;
            self.apellido = docenteEdit.apellido;
            self.fecnac = uibDateParser.parse(docenteEdit.fecnac, "dd/MM/yyyy");
            self.fijo = docenteEdit.fijo;
            self.celular = docenteEdit.celular;
            self.email = docenteEdit.email;
            self.domicilio = docenteEdit.domicilio;
            self.barrio = docenteEdit.barrio;
            self.ocupacion = docenteEdit.ocupacion;
            self.sexo = $filter('filter')(self.sexos, { nombre: docenteEdit.sexo })[0];
        }else{
            self.titulo = "Nuevo Docente";
            self.nacionalidad = undefined;
            self.provincia = undefined;
            self.sexo = undefined;
            self.localidad = undefined;
            self.dni = "";
            self.nombre = "";
            self.apellido = "";
            self.fecnac = "";
            self.fijo = "";
            self.celular = "";
            self.email = "";
            self.localidad = "";
            self.domicilio = "";
            self.barrio = "";
            self.ocupacion = "";
            self.today();
        }
    }

    // Configuracion del calendario
    self.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date(),
        minDate: new Date(1900, 1, 1),
        startingDay: 1
    };

    //Meotod para abrir y cerrar el calendario
    self.popup = {
        opened: false
    };

    //Formato de fecha para el atributo alt-input-formats
    self.altInputFormats = ['M!/d!/yyyy'];

     self.today = function() {
        self.fecnac = new Date(1980, 1, 1);
    };

    //Meotod para abrir y cerrar el calendario
    self.open = function() {
        self.popup.opened = true;
    };

    // Metodo que trae los datos de las localidades
    self.obtenerLocalidades = function () {
        self.localidades = [];
        LocalidadService.obtenerLocalidades().then(function(response){
            self.localidades = response.data.localidades;
            if(!_.isUndefined(docenteEdit)){
                self.localidad = $filter('filter')(self.localidades, { nombre: docenteEdit.localidad.nombre })[0]; 
                var provinciaId = self.localidad.provincia._id
                self.provincia = $filter('filter')(self.provincias, { _id: provinciaId })[0]; 
            }
            //$log.info("local Selected:"+ JSON.stringify(self.provincia));
        });
    }

    // Metodo que trae los datos de las localidades
    self.onSelectProvincia = function (item) {
        self.localidades = [];
        LocalidadService.obtenerLocalidadesPorProvincia(item._id).then(function(response){
            self.localidades = response.data.localidades;  
        });
    }

    // Metodo que trae los datos de las provincias
    self.obtenerPronvincias = function () {
        self.provincias = [];
        ProvinciaService.obtenerProvincias().then(function(response){
            self.provincias = response.data.provincias;
        });
    }

     // Metodo que trae los datos de las regiones
     self.obtenerRegiones = function () {
        self.regiones = [];
        NacionalidadService.obtenerNacionalidades().then(function(response){
            self.regiones = response.data.nacionalidades;
            self.nacionalidad = angular.isUndefined(docenteEdit) ? undefined : $filter('filter')(self.regiones, { nombre: docenteEdit.nacionalidad.nombre })[0]; 
            //$log.info("Nac Selected:"+ JSON.stringify(self.nacionalidad));
        });
    }

    // Metodo para capturar todo los valores de los campos del formulario en un objeto json
    self.datosDelDocente = function(){
        var fec = Date.parse(self.fecnac).toString('dd/MM/yyyy');
        var docente = new docenteJsonBody();
            docente.dni = self.dni;
            docente.nombre = self.nombre;
            docente.apellido = self.apellido;
            docente.nacionalidad = self.nacionalidad;
            docente.fecnac = fec;
            docente.sexo = self.sexo.nombre;
            docente.fijo = self.fijo;
            docente.celular = self.celular;
            docente.email = self.email;
            docente.localidad = self.localidad;
            docente.domicilio = self.domicilio;
            docente.barrio = self.barrio;
            docente.ocupacion = self.ocupacion;
            return docente;
    }

    // Evento click del boton guardar docente
    self.onClickGuardar = function (){
        if(angular.isUndefined(self.fecnac) || self.fecnac == "" || self.fecnac == null){
            self.showMessage(__facnac_vacio, 'info');
        }else{
            if(angular.isUndefined(self.provincia)){
                self.showMessage(__provincia_vacio, 'info');
            }else{
                if(angular.isUndefined(self.nacionalidad)){
                    self.showMessage(__nacionalidad_vacio, 'info');
                }else{
                    if(angular.isUndefined(self.sexo)){
                        self.showMessage(__sexo_vacio, 'info');
                    }else{
                        if(self.titulo == 'Nuevo Docente'){
                            self.guardarDocente();
                        }else{
                            self.editarDocente();
                        }
                    }
                }
            }
        }
    }

    // Meotod que guarda los datos de docentes
    self.guardarDocente = function () {
        self.guardandoDocenteBtn();
        var docente = self.datosDelDocente();
        DocenteService.guardarDocente(docente).then(function (response) {
            self.toggl = true;    
            self.showMessage(response.data.message, 'success');
            self.init();
        }, function (error) {
            self.toggl = false;
            if(error.status == 409){
                self.showMessage(error.data.message, 'warning');
            }else{
                self.showMessage(error.data.message, 'error');
            }
            self.guardarDocenteBtn();
        });
    }

    // Metodo para editar los datos del docente
    self.editarDocente = function () {
        var docente = self.datosDelDocente();
        DocenteService.editarDocente(docente, self.id)
           .then(function (response) {
                self.toggl = true; 
                self.showMessage(response.data.message, 'success');
                self.stateEdition = 'editado';
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

   // Contrato para guardar docentes
    var docenteJsonBody = function () {
        return {
            "nombre" : "",
            "apellido" : "",
            "fecnac" : "",
            "dni" : "",
            "sexo" : "",
            "email" : "",
            "fijo" : "",
            "celular" : "",
            "localidad" : "",
            "nacionalidad" : "",
            "domicilio" : "",
            "barrio" : "",
            "ocupacion" : ""
        }
    }

    // Metodo para manejar los estilos del boton
    self.guardandoDocenteBtn = function(){
        self.colorButton = "btn btn-default pull-right";
        self.labelButton = "Guardando..";
        self.typeButton = "button";
        self.iconButton = "fa fa-spinner fa-pulse fa-lg fa-fw";
    }

    // Metodo para manejar los estilos del boton 
    self.guardarDocenteBtn = function(){
        self.colorButton = "btn btn-primary pull-right";
        self.labelButton = "Guardar docente";
        self.typeButton = "submit";
        self.iconButton = "glyphicon glyphicon-floppy-disk";
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

    self.obtenerPronvincias();
    self.obtenerRegiones();
    self.obtenerLocalidades();
    self.init();
}
