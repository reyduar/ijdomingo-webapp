(function(angular){
/**************************************************************************
   * Set environment values
   *************************************************************************/
  
  // Default environment variables
  var __env = {};
  
  // Import variables if present
  if(window){
    Object.assign(__env, window.__env);
  }
  
  /**************************************************************************
   * Define Angular application
   *************************************************************************/
  
  var ngModule = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngSanitize', 'ui.select']);

    /**************************************************************************
   * Make environment available in Angular
   *************************************************************************/
  
  ngModule.constant('__env', __env);
  
  function logEnvironment($log, __env){
    $log.debug('Environment variables:');
    $log.debug(__env)
  }

  ngModule.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: "HomeController",
        controllerAs: "homeCtrl"
      })
      .state('inscripciones', {
        url: "/inscripciones",
        templateUrl: "app/views/inscripcion.html",
        controller: "InscripcionController",
        controllerAs: "insCtrl"
      })
      .state('editar', {
        url: "/editar/:id",
        templateUrl: "app/views/editarInscripcion.html",
        controller: "EditarInscripcionController",
        controllerAs: "editInsCtrl"
      })
    .state('alumnos', {
        url: "/alumnos",
        templateUrl: "app/views/alumno.html",
        controller: "AlumnoController",
        controllerAs: "alumnoCtrl"
      })
     .state('docentes', {
        url: "/docentes",
        templateUrl: "app/views/docentes.html",
        controller: "DocenteController",
        controllerAs: "docCtrl"
      })
    .state('cursos', {
        url: "/cursos",
        templateUrl: "app/views/curso.html",
        controller: "CursoController",
        controllerAs: "cursoCtrl"
      })
     .state('asistencias', {
        url: "/asistencias",
        templateUrl: "app/views/asistencia.html",
        controller: "AsistenciaController",
        controllerAs: "asiCtrl"
      })
     .state('notas', {
        url: "/notas",
        templateUrl: "app/views/notas.html",
        controller: "NotaController",
        controllerAs: "notaCtrl"
      })
  });

})(angular)