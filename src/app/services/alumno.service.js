angular.module('app').factory('AlumnoService', function AlumnoService($http, __env) {

    var service = {
       obtenerAlumnos: obtenerAlumnos,
        guardarAlumno: guardarAlumno,
        editarAlumno: editarAlumno,
        buscarAlumnoPorDni: buscarAlumnoPorDni,
        borrarAlumno: borrarAlumno,
        buscarAlumnoPorId: buscarAlumnoPorId
    };

    return service;

    // Metodo para traer todos los alumnos 
    function obtenerAlumnos() {
      var uri = __env.apiUrl + 'alumnos';
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    // Metodo para guardar alumno
    function guardarAlumno(body) {
      var uri = __env.apiUrl + 'alumno/agregar';
      return $http({
          url: uri,
          method: "POST",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

     // Metodo para editar alumno
    function editarAlumno(body, id) {
      var uri = __env.apiUrl + 'alumno/editar/' + id;
      return $http({
          url: uri,
          method: "PUT",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

     // Metodo para traer todos los alumnos 
    function buscarAlumnoPorDni(dni) {
      var uri = __env.apiUrl + 'alumno/buscar/dni/' + dni;
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    // Metodo para alumno por id
    function buscarAlumnoPorId(id) {
        var uri = __env.apiUrl + 'alumno/buscar/id/' + id;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
      }

     // Metodo para borrar alumno
    function borrarAlumno(id) {
      var uri = __env.apiUrl + 'alumno/borrar/' + id;
      return $http({
          url: uri,
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }
});