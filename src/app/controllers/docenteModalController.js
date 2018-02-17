angular.module('app').controller('DocenteModalController', DocenteModalController);

function DocenteModalController(ApiService, $uibModalInstance, $timeout, docenteEdit, uibDateParser, $filter, $log) {

    var self = this;
    self.mostarMensaje = false;
    self.toggl = false;    
    self.sexos = [ { nombre: "Masculino" }, { nombre: "Femenino" } ];

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
            self.localidad = docenteEdit.localidad;
            self.domicilio = docenteEdit.domicilio;
            self.barrio = docenteEdit.barrio;
            self.ocupacion = docenteEdit.ocupacion;
            self.sexo = $filter('filter')(self.sexos, { nombre: docenteEdit.sexo })[0];
        }else{
            self.titulo = "Agregar Nuevo Docente";
            self.nacionalidad = undefined;
            self.provincia = undefined;
            self.sexo = undefined;
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

    // Metodo que trae los datos de las provincias
    self.obtenerPronvincias = function () {
        self.provincias = [];
        ApiService.obtenerPronvincias().then(function(response){
            self.provincias = response.data;
            self.provincia = angular.isUndefined(docenteEdit) ? undefined : $filter('filter')(self.provincias, { nombre: docenteEdit.provincia })[0]; 
        });
    }

    // Metodo que trae los datos de las regiones
    self.obtenerRegiones = function () {
        self.regiones = [];
        ApiService.obtenerRegiones().then(function(response){
            self.regiones = response.data;
            self.nacionalidad = angular.isUndefined(docenteEdit) ? undefined : $filter('filter')(self.regiones, { gentilicio: docenteEdit.nacionalidad })[0]; 
        });
    }

    // Metodo para capturar todo los valores de los campos del formulario en un objeto json
    self.datosDelDocente = function(){
        var fec = Date.parse(self.fecnac).toString('dd/MM/yyyy');
        var docente = new docenteJsonBody();
            docente.dni = self.dni;
            docente.nombre = self.nombre;
            docente.apellido = self.apellido;
            docente.nacionalidad = self.nacionalidad.gentilicio;
            docente.fecnac = fec;
            docente.sexo = self.sexo.nombre;
            docente.fijo = self.fijo;
            docente.celular = self.celular;
            docente.email = self.email;
            docente.provincia = self.provincia.nombre;
            docente.localidad = self.localidad;
            docente.domicilio = self.domicilio;
            docente.barrio = self.barrio;
            docente.ocupacion = self.ocupacion;
            return docente;
    }

    // Evento click del boton guardar docente
    self.onClickGuardar = function (){
        if(angular.isUndefined(self.fecnac) || self.fecnac == ""){
            alerta("__facnac_vacio");
        }else{
            if(angular.isUndefined(self.provincia)){
                alerta("__provincia_vacio");
            }else{
                if(angular.isUndefined(self.nacionalidad)){
                    alerta("__nacionalidad_vacio");
                }else{
                    if(angular.isUndefined(self.sexo)){
                        alerta("__sexo_vacio");
                    }else{
                        if(self.titulo == 'Agregar Nuevo Docente'){
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
        ApiService.guardarDocente(docente).then(function (response) {
            self.toggl = true;    
            alerta("__exito_al_guardar");
            self.init();
        }, function (error) {
            self.toggl = false;
            alerta("__error_al_guardar");
        });
    }

    // Metodo para editar los datos del docente
    self.editarDocente = function () {
        var docente = self.datosDelDocente();
        ApiService.editarDocente(docente, self.id)
           .then(function (response) {
                self.toggl = true; 
                self.stateEdition = 'editado';
                $uibModalInstance.close(self);
           }, function (error) {
                self.toggl = false;
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
            "nacionalidad" : "",
            "fecnac" : "",
            "dni" : "",
            "sexo" : "",
            "email" : "",
            "fijo" : "",
            "celular" : "",
            "provincia" : "",
            "localidad" : "",
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

    // Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_guardar":
                self.alertMsg = "Error al guardar los datos del docente";
                self.alert = 'alert alert-danger alert-dismissible';
                self.alertType = 'Error';
                break;
            case "__exito_al_guardar":
                self.alertMsg = "Los datos del docente se guardaron exitosamente";
                self.alert = 'alert alert-success alert-dismissible';
                self.alertType = 'Exito';
                break;
            case "__nacionalidad_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione una nacionalidad";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__provincia_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione una provincia";
                self.alert = 'alert alert-info ui-notification';
                break;
            case "__sexo_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "Seleccione un sexo";
                self.alert = 'alert alert-info ui-notification';
                break;
             case "__facnac_vacio":
                self.icon = 'glyphicon glyphicon-info-sign';
                self.alertMsg = "La fecha de nacimiento esta vacia";
                self.alert = 'alert alert-info ui-notification';
                break;
        }
        $timeout(function () {  self.mostarMensaje = false; }, 3000);
    }

    self.obtenerPronvincias();
    self.obtenerRegiones();
    self.init();
}
