angular.module('app').controller('NotaController', NotaController);
    
function NotaController(NotaService, AlumnoService, ProvinciaService, LocalidadService, CursoService, $log, $uibModal, $timeout, $state, toastr, $rootScope){
  
	var self = this;
  
    self.curso = undefined;
    self.provincia = undefined;
    self.localidad = undefined;
    self.alumno = undefined;
	self.verlista = false;
	// Metodo que genera la lista de notas
	self.obtenerNotas = function () {
        self.notas = [];
        $timeout(function () {
            if (!_.isEmpty($rootScope.periodo_lectivo)) {
                NotaService.obtenerNotas($rootScope.periodo_lectivo._id).then(function (response) {
                    self.notas = response.data.notas;
                    self.exportarEXcel();
                    self.verLista();
                });
            } else {
                self.showMessage('No existe un periodo lectivo activo', 'info');
            }
        }, 2000);
	}

    self.enterSearch = function (keyEvent) {
        if (keyEvent.which === 13)
            self.buscarAlumnoPorDni();
    }

    self.verLista = function () {
        if (_.isEmpty(self.notas))
            self.verlista = false;
        else    
            self.verlista = true;
    };

    // Metodo que trae los datos de las provincias
	self.obtenerPronvincias = function () {
		self.provincias = [];
		ProvinciaService.obtenerProvincias().then(function(response){
	    	self.provincias = response.data.provincias;
		});
	}

	// Metodo que trae los datos de las localidades
    self.obtenerLocalidades = function () {
        self.localidades = [];
        LocalidadService.obtenerLocalidades().then(function(response){
            self.localidades = response.data.localidades;
        });
    }

	// Metodo que trae los datos de las localidades
    self.onSelectProvincia = function (item) {
        self.localidades = [];
        LocalidadService.obtenerLocalidadesPorProvincia(item._id).then(function(response){
            self.localidades = response.data.localidades;  
        });
    }

    // Metodo que para restablecer los filtros
    self.restarFiltro = function () {
        self.curso = undefined;
        self.provincia = undefined;
        self.localidad = undefined;
        self.obtenerNotas();
    }

    // Metodo que genera la lista de cursos
    self.obtenerCursos = function () {
        self.cursos = [];
        CursoService.obtenerCursos().then(function (response) {
            self.cursos = response.data.cursos;
        });
    }

     self.buscarAlumnoPorDni = function () {
        if(!_.isEmpty(self.dni)){
            AlumnoService.buscarAlumnoPorDni(self.dni)
            .then(function (response) {
                if(!_.isEmpty(response.data.alumnoDni)){
                    self.alumno = response.data.alumnoDni[0];
                    self.buscarNotaPorAlumno();
                }else{
                    self.showMessage('El alumno no se encuentra', 'info');
                }
                    
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
        }else{
            self.showMessage('Ingrese el DNI del alumno para buscar.', 'warning');
        }
    };

    self.buscarNotaPorAlumno = function () {
        self.notas = [];
        NotaService.buscarNotaPorAlumno($rootScope.periodo_lectivo._id, self.alumno._id)
            .then(function (response) {
                if(!_.isEmpty(response.data.notas)){
                    self.notas = response.data.notas;
                }else{
                    self.showMessage('Posiblemente el alumno no fue inscripto en este periodo, intente buscando en otro periodo', 'info');
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
    };

    self.busquedaAvanzada = function (){
         if(_.isEmpty(self.curso)){
             self.showMessage('Seleccione un curso.', 'info');
         }

         if(_.isEmpty(self.provincia)){
             self.showMessage('Seleccione una provincia.', 'info');
         }

         if(_.isEmpty(self.localidad)){
             self.showMessage('Seleccione una localidad.', 'info');
         }

         if( _.isEmpty($rootScope.periodo_lectivo)){
             self.showMessage('Seleccione un periodo.', 'info');
         }

         if(!_.isEmpty(self.curso) && !_.isEmpty(self.provincia) && !_.isEmpty(self.localidad) && !_.isEmpty($rootScope.periodo_lectivo)){
             self.notas = [];
             var q = query();
             q.curso = self.curso._id;
             q.provincia = self.provincia._id;
             q.localidad = self.localidad._id;
             NotaService.buscarNotasPorFiltros($rootScope.periodo_lectivo._id, q)
            .then(function (response) {
                if(!_.isEmpty(response.data.notas)){
                    self.notas = response.data.notas;
                }else{
                    self.showMessage('No existen datos de notas para esos filtros', 'info');
                }
            }, function (error) {
                self.showMessage(error.data.message, 'error');
            });
         }
    };

    var query = function () {
        return {
            "curso": "",
            "provincia": "",
            "localidad": ""
        }
    } 


    // Metodo que prepara los datos para exportar a excel
    self.exportarEXcel = function(){
        // Prepare Excel data:
        self.fileName = "datos-de-notas";
        self.exportData = [];
        // Headers:
        self.exportData.push(["DNI", "ALUMNO", "CURSO", "LOCALIDAD", "EXAMEN PARCIAL", "EXAMEN FINAL", "TOTAL", "ASISTENCIA(%)"]);
        // Data:
        angular.forEach(self.notas, function(value, key) {
            self.exportData.push([value.alumno.dni, value.alumno.nombre+" "+value.alumno.apellido, value.curso.nombre, value.localidad.nombre, value.exaparcial, value.exafinal, value.exatotal, value.asistencia]);
        });
    }

	// Metodo que llama al modal de agregar alumnos
    self.agregarNota = function (nota) {
        var modalInstance = $uibModal.open({
            controller: 'NotaModalController',
            controllerAs: 'notaModalCtrl',
            templateUrl: 'app/controllers/nota.new.html',
            size: 'lg',
            resolve: {
                notaEdit: function () {
                    return nota;
                }
            }
        });

        modalInstance.result.then(function (resultado) {
            resultado.toggl ? self.obtenerNotas() : $log.log("Nothing to do!");
            if(resultado.stateEdition == 'editado'){
                //__exito_al_editar
                self.obtenerNotas()
            } if(resultado.stateEdition == 'error'){
                //__error_al_editar
            }
            
        }, function () {
            // Cuando el modal se cierra
            self.obtenerNotas();
        });
    }

    // Metodo para mostrar modal del confirmacion para borrar un curso
    self.borrarOnClick = function(index, nota) {
        bootbox.confirm({
            title: "Borrar Nota",
            message: "¿Estas seguro que desea borrar la nota de "+ nota.alumno.nombre +" "+ nota.alumno.apellido+"?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> No'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Si'
                }
            },
            callback: function (result) {
                if(result){
                    NotaService.borrarNota(nota._id)
                    .then(function (response) {
                        self.obtenerNotas();
                        self.showMessage(response.data.message, 'success');
                    }, function (error) {
                        self.showMessage(error.data.message, 'error');
                    });
                }
            }
        });
    };

    self.verOnClick = function(item){
        var nota = '';
        nota += '<pre>';
        nota += '<em>DNI: </em>'+ item.alumno.dni;
        nota += '<br ><em>Alumno: </em>'+ item.alumno.nombre + ' ' + item.alumno.apellido;
        nota += '<br ><em>Curso: </em>'+ item.curso.nombre;
        nota += '<br ><em>Asistencia : </em>'+ item.asistencia + '%';
        nota += '<br ><em>Examen Parcial: </em>'+ item.exaparcial;
        nota += '<br ><em>Examen Final: </em>'+ item.exafinal;
        nota += '<br ><em>Total de Puntos: </em>'+ item.exatotal;
        nota += '</pre>';
        bootbox.alert({
            title: "Nota",
            message: nota
        });
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
    };

  	// Hago la llamada a todos los servicios que traer datos
	self.obtenerNotas();
    self.obtenerCursos();
    self.obtenerPronvincias();
    self.obtenerLocalidades();
}