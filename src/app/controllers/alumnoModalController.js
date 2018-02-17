angular.module('app').controller('AlumnoModalController', AlumnoModalController);

function AlumnoModalController(ApiService, $uibModalInstance, $timeout, alumnoEdit, uibDateParser, $filter, $log) {

    var self = this;
    self.mostarMensaje = false;
    self.toggl = false;    
    self.sexos = [ { nombre: "Masculino" }, { nombre: "Femenino" } ];

    self.init = function (){
        self.guardarAlumnoBtn();
        self.stateEdition = '';
        if(!angular.isUndefined(alumnoEdit)){
            self.titulo = "Editar Alumno";
            self.id = alumnoEdit._id;
            self.dni = alumnoEdit.dni;
            self.nombre = alumnoEdit.nombre;
            self.apellido = alumnoEdit.apellido;
            self.fecnac = uibDateParser.parse(alumnoEdit.fecnac, "dd/MM/yyyy");
            self.fijo = alumnoEdit.fijo;
            self.celular = alumnoEdit.celular;
            self.email = alumnoEdit.email;
            self.localidad = alumnoEdit.localidad;
            self.domicilio = alumnoEdit.domicilio;
            self.barrio = alumnoEdit.barrio;
            self.ocupacion = alumnoEdit.ocupacion;
            self.sexo = $filter('filter')(self.sexos, { nombre: alumnoEdit.sexo })[0];
        }else{
            self.titulo = "Agregar Nuevo Alumno";
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
            self.provincia = angular.isUndefined(alumnoEdit) ? undefined : $filter('filter')(self.provincias, { nombre: alumnoEdit.provincia })[0]; 
            $log.info("Prov Selected:"+ JSON.stringify(self.provincia));
        });
    }

    // Metodo que trae los datos de las regiones
    self.obtenerRegiones = function () {
        self.regiones = [];
        ApiService.obtenerRegiones().then(function(response){
            self.regiones = response.data;
            self.nacionalidad = angular.isUndefined(alumnoEdit) ? undefined : $filter('filter')(self.regiones, { gentilicio: alumnoEdit.nacionalidad })[0]; 
            $log.info("Nac Selected:"+ JSON.stringify(self.nacionalidad));
        });
    }

    // Metodo para capturar todo los valores de los campos del formulario en un objeto json
    self.datosDelAlumno = function(){
        var fec = Date.parse(self.fecnac).toString('dd/MM/yyyy');
        var alumno = new alumnoJsonBody();
            alumno.dni = self.dni;
            alumno.nombre = self.nombre;
            alumno.apellido = self.apellido;
            alumno.nacionalidad = self.nacionalidad.gentilicio;
            alumno.fecnac = fec;
            alumno.sexo = self.sexo.nombre;
            alumno.fijo = self.fijo;
            alumno.celular = self.celular;
            alumno.email = self.email;
            alumno.provincia = self.provincia.nombre;
            alumno.localidad = self.localidad;
            alumno.domicilio = self.domicilio;
            alumno.barrio = self.barrio;
            alumno.ocupacion = self.ocupacion;
            return alumno;
    }

    // Evento click del boton guardar alumno
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
                        if(self.titulo == 'Agregar Nuevo Alumno'){
                            self.guardarAlumno();
                        }else{
                            self.editarAlumno();
                        }
                    }
                }
            }
        }
        
    }

    // Meotod que guarda los datos de alumnos
    self.guardarAlumno = function () {
        self.guardandoAlumnoBtn();
        var alumno = self.datosDelAlumno();
        ApiService.guardarAlumno(alumno).then(function (response) {
            self.toggl = true;    
            alerta("__exito_al_guardar");
            self.init();
        }, function (error) {
            self.toggl = false;
            alerta("__error_al_guardar");
        });
    }

    // Metodo para editar los datos del alumno
    self.editarAlumno = function () {
        var alumno = self.datosDelAlumno();
        ApiService.editarAlumno(alumno, self.id)
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

   // Contrato para guardar alumnos
    var alumnoJsonBody = function () {
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
    self.guardandoAlumnoBtn = function(){
        self.colorButton = "btn btn-default pull-right";
        self.labelButton = "Guardando..";
        self.typeButton = "button";
        self.iconButton = "fa fa-spinner fa-pulse fa-lg fa-fw";
    }

    // Metodo para manejar los estilos del boton 
    self.guardarAlumnoBtn = function(){
        self.colorButton = "btn btn-primary pull-right";
        self.labelButton = "Guardar Alumno";
        self.typeButton = "submit";
        self.iconButton = "glyphicon glyphicon-floppy-disk";
    }

    // Metodo que muestra los mensajes de errores
    var alerta = function (validation) {
        self.mostarMensaje = true;
        switch (validation) {
            case "__error_al_guardar":
                self.alertMsg = "Error al guardar los datos del alumno";
                self.alert = 'alert alert-danger alert-dismissible';
                self.alertType = 'Error';
                break;
            case "__exito_al_guardar":
                self.alertMsg = "Los datos del alumno se guardaron exitosamente";
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
