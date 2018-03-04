angular.module('app').factory('InscripcionService', function InscripcionService($http, __env) {

    var service = {
        guardarInscripcion: guardarInscripcion,
        buscarInscripciones: buscarInscripciones,
        buscarInscripcionPorId: buscarInscripcionPorId,
        buscarInscripcionPorDniYCurso: buscarInscripcionPorDniYCurso,
        borraInscripcion: borraInscripcion,
        buscarInscripcionesPorCurso: buscarInscripcionesPorCurso,
        buscarInscripcionesPorPeriodo: buscarInscripcionesPorPeriodo,
        buscarInscripcionesPorAlumno: buscarInscripcionesPorAlumno,
        editarInscripcion: editarInscripcion

    };

    return service;

    function guardarInscripcion(body) {
        var uri = __env.apiUrl + 'inscripcion/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para editar la inscripcion
      function editarInscripcion(id, body) {
        var uri = __env.apiUrl + 'inscripcion/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
       // Metodo para buscar todas las inscripciones
      function buscarInscripciones(periodo, q) {
        var uri = __env.apiUrl + 'inscripciones/buscar/lista/'+periodo+"?curso="+q.curso+"&provincia="+q.provincia+"&localidad="+q.localidad;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };

      // Metodo para buscar todas las inscripciones de un periodo
      function buscarInscripcionesPorPeriodo(periodo) {
        var uri = __env.apiUrl + 'inscripciones/buscar/periodo/'+periodo;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };

       // Metodo para buscar todas las inscripciones de un alumno
      function buscarInscripcionesPorAlumno(periodo, alumno) {
        var uri = __env.apiUrl + 'inscripcion/buscar/alumno/'+periodo+'/'+alumno;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para buscar las inscripciones por dni y curso
      function buscarInscripcionPorDniYCurso(dni, curso) {
        var uri = __env.apiUrl + 'inscripcion/buscar/cursodni/' + dni + '/' + encodeURIComponent(curso);
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
  
       // Metodo para buscar las inscripciones por curso
      function buscarInscripcionesPorCurso(curso) {
        var uri = __env.apiUrl + 'inscripcion/buscar/curso/' + encodeURIComponent(curso);
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para buscar las inscripciones por id
      function buscarInscripcionPorId(id) {
        var uri = __env.apiUrl + 'inscripcion/buscar/id/' + id;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
       // Metodo para borrar inscripciones
      function borraInscripcion(id) {
        var uri = __env.apiUrl + 'inscripcion/borrar/'+id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
    
});