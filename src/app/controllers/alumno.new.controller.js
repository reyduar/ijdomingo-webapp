angular.module('app').controller('AlumnoModalController', AlumnoModalController);

function AlumnoModalController(toastr, LocalidadService, ProvinciaService, NacionalidadService, AlumnoService, $uibModalInstance, $timeout, alumnoEdit, uibDateParser, $filter, $log, acceso) {

    var self = this;
    self.mostarMensaje = false;
    self.toggl = false;    
    self.sexos = [ { nombre: "Masculino" }, { nombre: "Femenino" } ];
    var __facnac_vacio = 'Ingrese una fecha de nacimiento válida.';
    var __sexo_vacio = 'Seleccione un sexo.';
    var __provincia_vacio = 'Seleccione una provincia.';
    var __nacionalidad_vacio = 'Seleccione una nacionalidad.';
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
            self.today();
            self.titulo = "Nuevo Alumno";
            self.nacionalidad = undefined;
            self.provincia = undefined;
            self.localidad = undefined;
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
            if(!_.isUndefined(alumnoEdit)){
                self.localidad = $filter('filter')(self.localidades, { nombre: alumnoEdit.localidad.nombre })[0]; 
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
            self.nacionalidad = angular.isUndefined(alumnoEdit) ? undefined : $filter('filter')(self.regiones, { nombre: alumnoEdit.nacionalidad.nombre })[0]; 
            //$log.info("Nac Selected:"+ JSON.stringify(self.nacionalidad));
        });
    }

    // Metodo para capturar todo los valores de los campos del formulario en un objeto json
    self.datosDelAlumno = function(){
        var fec = Date.parse(self.fecnac).toString('dd/MM/yyyy');
        var alumno = new alumnoJsonBody();
            alumno.dni = self.dni;
            alumno.nombre = self.nombre;
            alumno.apellido = self.apellido;
            alumno.nacionalidad = self.nacionalidad;
            alumno.fecnac = fec;
            alumno.sexo = self.sexo.nombre;
            alumno.fijo = self.fijo;
            alumno.celular = self.celular;
            alumno.email = self.email;
            alumno.localidad = self.localidad;
            alumno.domicilio = self.domicilio;
            alumno.barrio = self.barrio;
            alumno.ocupacion = self.ocupacion;
            return alumno;
    }

    // Evento click del boton guardar alumno
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
                        if(self.titulo == 'Nuevo Alumno'){
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
        AlumnoService.guardarAlumno(alumno).then(function (response) {
            self.toggl = true;    
            self.showMessage(response.data.message, 'success');
            self.init();
            if (_.includes(acceso, 'inscripciones'))
                $uibModalInstance.close(self);
        }, function (error) {
            self.toggl = false;
            if(error.status == 409){
                self.showMessage(error.data.message, 'warning');
            }else{
                self.showMessage(error.data.message, 'error');
            }
            self.guardarAlumnoBtn();
        });
    }

    // Metodo para editar los datos del alumno
    self.editarAlumno = function () {
        var alumno = self.datosDelAlumno();
        AlumnoService.editarAlumno(alumno, self.id)
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
