angular.module('app').factory('NotaService', function NotaService($http, __env) {

    var service = {
        guardarNota: guardarNota,
        editarNota: editarNota,
        borrarNota: borrarNota,
        obtenerNotas: obtenerNotas,
        buscarNotasPorFiltros: buscarNotasPorFiltros,
        buscarNotaPorId: buscarNotaPorId,
        buscarNotaPorAlumno: buscarNotaPorAlumno
    };

    return service;


     // Metodo para traer todos las notas 
     function obtenerNotas(periodo) {
        var uri = __env.apiUrl + 'notas/buscar/lista/'+periodo;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para guardar nota
      function guardarNota(body) {
        var uri = __env.apiUrl + 'nota/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para editar nota
      function editarNota(id, body) {
        var uri = __env.apiUrl + 'nota/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
       // Metodo para borrar nota
      function borrarNota(id) {
        var uri = __env.apiUrl + 'nota/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para buscar las notas por dni y curso
      function buscarNotaPorAlumno(periodo, alumno) {
        var uri = __env.apiUrl + 'notas/buscar/alumno/' + periodo + '/' + alumno;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
  
      // Metodo para buscar las notas por curso
      function buscarNotasPorFiltros(periodo, q) {
        var uri = __env.apiUrl + 'notas/buscar/query/' +periodo+"?curso="+q.curso+"&provincia="+q.provincia+"&localidad="+q.localidad;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
  
      // Metodo para buscar nota por id
      function buscarNotaPorId(id) {
        var uri = __env.apiUrl + 'nota/buscar/id/' + id;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      };
});