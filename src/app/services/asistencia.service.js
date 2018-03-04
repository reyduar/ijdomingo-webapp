angular.module('app').factory('AsistenciaService', function AsistenciaService($http, __env) {

    var service = {
        guardarAsistencia: guardarAsistencia,
        buscarAsistenciaPorDniYCurso: buscarAsistenciaPorDniYCurso,
        buscarAsistenciaPorFecha: buscarAsistenciaPorFecha,
        editarAsistencia: editarAsistencia
    };

    return service;


   // Metodo para guardar asistencia
    function guardarAsistencia(body) {
      var uri = __env.apiUrl + 'asistencia/agregar';
      return $http({
          url: uri,
          method: "POST",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    };

    // Metodo para editar la asistencia
    function editarAsistencia(id, body) {
      var uri = __env.apiUrl + 'asistencia/editar/' + id;
      return $http({
          url: uri,
          method: "PATCH",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    };

    // Metodo para buscar asitencia de un alumno
    function buscarAsistenciaPorDniYCurso(dni, curso, fecha) {
      var uri = __env.apiUrl + 'asistencia/buscar/dni/'+dni+'/curso/'+curso+'/fecha/'+encodeURIComponent(fecha);
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    };

    // Metodo para buscar asitencia por curso y fecha
    function buscarAsistenciaPorFecha(periodo, q) {
      var uri = __env.apiUrl + 'asistencias/buscar/lista/'+periodo+"?curso="+q.curso+"&provincia="+q.provincia+"&localidad="+q.localidad+"&fecha="+encodeURIComponent(q.fecha);
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    };
});