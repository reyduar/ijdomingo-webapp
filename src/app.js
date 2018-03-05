(function (angular) {
  /**************************************************************************
     * Set environment values
     *************************************************************************/

  // Default environment variables
  var __env = {};

  // Import variables if present
  if (window) {
    Object.assign(__env, window.__env);
  }

  /**************************************************************************
   * Define Angular application
   *************************************************************************/

  var ngModule = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngSanitize', 'ui.select', 'angular-loading-bar', 'ngAnimate', 'toastr', 'ngStorage', 'angular-jwt']);

  /**************************************************************************
 * Make environment available in Angular
 *************************************************************************/

  ngModule.constant('__env', __env);

  function logEnvironment($log, __env) {
    $log.debug('Environment variables:');
    $log.debug(__env)
  }


  ngModule.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthTokenInterceptor');
  });

  ngModule.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
      closeButton: true,
      timeOut: 7000,
      extendedTimeOut: 0,
      autoDismiss: false,
      containerId: 'toast-container',
      maxOpened: 0,
      newestOnTop: true,
      positionClass: 'toast-top-full-width',
      preventDuplicates: false,
      preventOpenDuplicates: true
    });
  });

  ngModule.config(function ($stateProvider, $urlRouterProvider) {

    function getPeriodoLectivo($rootScope, PeriodoService, $state, $log) {
      return PeriodoService.getPeriodoActivo()
        .then(function (response) {
          if (!_.isEmpty(response.data.periodo))
            $rootScope.periodo_lectivo = response.data.periodo;
          else
            $state.go('periodos');
            //$log.log("Periodo Activo :" +JSON.stringify($rootScope.periodo_lectivo.nombre))
        });
    };

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('nueva-inscripcion', { reload: true, notify: true });
  });

    $stateProvider
      .state('nueva-inscripcion', {
        url: "/nueva-inscripcion",
        templateUrl: "app/controllers/inscripcion.new.html",
        controller: "HomeController",
        controllerAs: "homeCtrl",
        resolve: {
          authenticate: authenticate,
          periodoResolve: getPeriodoLectivo
        }
      })
      .state('inscripciones', {
        url: "/inscripciones",
        templateUrl: "app/controllers/inscripcion.html",
        controller: "InscripcionController",
        controllerAs: "insCtrl",
        resolve: {
          periodoResolve: getPeriodoLectivo,
          authenticate: authenticate
        }
      })
      .state('editar', {
        url: "/editar/:id",
        templateUrl: "app/controllers/inscripcion.edit.html",
        controller: "EditarInscripcionController",
        controllerAs: "editInsCtrl",
        resolve: {
          periodoResolve: getPeriodoLectivo,
          authenticate: authenticate
        }
      })
      .state('alumnos', {
        url: "/alumnos",
        templateUrl: "app/controllers/alumno.html",
        controller: "AlumnoController",
        controllerAs: "alumnoCtrl",
        resolve: {
          authenticate: authenticate
        }
      })
      .state('docentes', {
        url: "/docentes",
        templateUrl: "app/controllers/docente.html",
        controller: "DocenteController",
        controllerAs: "docCtrl",
        resolve: {
          authenticate: authenticate
        }
      })
      .state('cursos', {
        url: "/cursos",
        templateUrl: "app/controllers/curso.html",
        controller: "CursoController",
        controllerAs: "cursoCtrl",
        resolve: {
          authenticate: authenticate
        }
      })
      .state('provincias', {
        url: "/provincias",
        templateUrl: "app/controllers/provincia.html",
        controller: "ProvinciaController",
        controllerAs: "provinciaCtrl",
        resolve: {
          authenticate: authenticate
        }
      })
      .state('localidades', {
        url: "/localidades",
        templateUrl: "app/controllers/localidad.html",
        controller: "LocalidadController",
        controllerAs: "localidadCtrl",
        resolve: {
          authenticate: authenticate
        }
      })
      .state('periodos', {
        url: "/periodos",
        templateUrl: "app/controllers/periodo.html",
        controller: "PeriodoController",
        controllerAs: "periodoCtrl",
        resolve: {
          periodoResolve: getPeriodoLectivo,
          authenticate: authenticate
        }
      })
      .state('asistencias', {
        url: "/asistencias",
        templateUrl: "app/controllers/asistencia.html",
        controller: "AsistenciaController",
        controllerAs: "asiCtrl",
        resolve: {
          periodoResolve: getPeriodoLectivo,
          authenticate: authenticate
        }
      })
      .state('notas', {
        url: "/notas",
        templateUrl: "app/controllers/notas.html",
        controller: "NotaController",
        controllerAs: "notaCtrl",
        resolve: {
          periodoResolve: getPeriodoLectivo,
          authenticate: authenticate
        }
      })
      .state('login', {
        url: "/login",
        templateUrl: "app/controllers/login.html",
        controller: "LoginController",
        controllerAs: "lgCtrl"
      })

      function authenticate($q, AuthService, $state, $timeout, $log) {
        if (AuthService.isAuthenticated()) {
          // Resolve the promise successfully
          return $q.when()
        } else {
          // The next bit of code is asynchronously tricky.
  
          $timeout(function() {
            // This code runs after the authentication promise has been rejected.
            // Go to the log-in page
            $state.go('login')
          })
  
          // Reject the authentication promise to prevent the state from loading
          return $q.reject()
        }
      }
  });

})(angular)