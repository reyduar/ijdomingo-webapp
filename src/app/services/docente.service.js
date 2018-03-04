angular.module('app').factory('DocenteService', function DocenteService($http, __env) {

    var service = {
        obtenerDocentes: obtenerDocentes,
        guardarDocente: guardarDocente,
        editarDocente: editarDocente,
        borrarDocente: borrarDocente,
        buscarDocentePorDni: buscarDocentePorDni
    };

    return service;


    // Metodo para traer todos los docentes 
    function obtenerDocentes() {
        var uri = __env.apiUrl + 'docentes';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }
  
      // Metodo para guardar docente
      function guardarDocente(body) {
        var uri = __env.apiUrl + 'docente/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }
  
       // Metodo para editar docente
      function editarDocente(body, id) {
        var uri = __env.apiUrl + 'docente/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }
  
       // Metodo para borrar docente
      function borrarDocente(id) {
        var uri = __env.apiUrl + 'docente/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }
  
       // Metodo para buscar un docente por dni
      function buscarDocentePorDni(dni) {
        var uri = __env.apiUrl + 'docentes/buscar/dni/' + dni;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }
});