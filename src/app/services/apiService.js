angular.module('app').factory('ApiService', function ApiService($http, __env) {
  
  var service = { 
    obtenerAlumnos: obtenerAlumnos,
    guardarAlumno: guardarAlumno,
    editarAlumno: editarAlumno,
    buscarAlumnoPorDni: buscarAlumnoPorDni,
    borrarAlumno: borrarAlumno,
    obtenerCursos: obtenerCursos,
    guardarCurso: guardarCurso,
    editarCurso: editarCurso,
    borrarCurso: borrarCurso,
    guardarInscripcion: guardarInscripcion,
    buscarInscripciones: buscarInscripciones,
    buscarInscripcionPorId: buscarInscripcionPorId,
    editarInscripcion: editarInscripcion,
    obtenerPronvincias: obtenerPronvincias,
    obtenerRegiones: obtenerRegiones,
    buscarInscripcionPorDniYCurso: buscarInscripcionPorDniYCurso,
    borraInscripcion: borraInscripcion,
    buscarInscripcionesPorCurso: buscarInscripcionesPorCurso,
    guardarAsistencia: guardarAsistencia,
    buscarAsistenciaPorDniYCurso: buscarAsistenciaPorDniYCurso,
    buscarAsistenciaCursoYFecha: buscarAsistenciaCursoYFecha,
    editarAsistencia: editarAsistencia,
    obtenerDocentes: obtenerDocentes,
    guardarDocente: guardarDocente,
    editarDocente: editarDocente,
    borrarDocente: borrarDocente,
    buscarDocentePorDni: buscarDocentePorDni,
    guardarNota: guardarNota,
    editarNota: editarNota,
    borrarNota: borrarNota,
    obtenerNotas: obtenerNotas,
    buscarNotaPorDniYCurso: buscarNotaPorDniYCurso,
    buscarNotasPorCurso: buscarNotasPorCurso,
    buscarNotaPorId: buscarNotaPorId
  };

  return service;

    //****************************//
    //*Operaciones de Notas *//
    //****************************//
    // Metodo para traer todos las notas 
    function obtenerNotas() {
      var uri = __env.apiUrl + 'notas';
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

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
    }

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
    }

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
    }

    // Metodo para buscar las notas por dni y curso
    function buscarNotaPorDniYCurso(dni, curso) {
      var uri = __env.apiUrl + 'nota/buscar/cursodni/' + dni + '/' + encodeURIComponent(curso);
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }


    // Metodo para buscar las notas por curso
    function buscarNotasPorCurso(curso) {
      var uri = __env.apiUrl + 'nota/buscar/curso/' + encodeURIComponent(curso);
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

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
    }

    //****************************//
    //*Operaciones de Asistencia *//
    //****************************//
    
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
    }

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
    }

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
    }

    // Metodo para buscar asitencia por curso y fecha
    function buscarAsistenciaCursoYFecha(curso, fecha) {
      var uri = __env.apiUrl + 'asistencia/buscar/curso/'+curso+'/fecha/'+encodeURIComponent(fecha);
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    //*************************//
    //*Operaciones de Alumnos *//
    //*************************//

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

    //*************************//
    //*Operaciones de Docentes *//
    //*************************//

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

    //***********************//
    //*Operaciones de Curso *//
    //***********************//

    // Metodo para traer todos los cursos 
    function obtenerCursos() {
      var uri = __env.apiUrl + 'cursos';
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    // Metodo para guardar curso
    function guardarCurso(body) {
      var uri = __env.apiUrl + 'curso/agregar';
      return $http({
          url: uri,
          method: "POST",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    // Metodo para editar curso
    function editarCurso(id, body) {
      var uri = __env.apiUrl + 'curso/editar/'+ id;
      return $http({
          url: uri,
          method: "PUT",
          data: body,
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

    // Metodo para borrar curso
    function borrarCurso(id) {
      var uri = __env.apiUrl + 'curso/borrar/' + id;
      return $http({
          url: uri,
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }


    //*****************************//
    //*Operaciones de Inscripcion *//
    //*****************************//
    // Metodo para guardar curso
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
    }

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
    }

     // Metodo para buscar todas las inscripciones
    function buscarInscripciones() {
      var uri = __env.apiUrl + 'inscripciones';
      return $http({
          url: uri,
          method: "GET",
          headers: { "Content-Type": "application/json" }
      }).then(function (response) {
          return response;
      });
    }

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
    }


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
    }

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
    }

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
    }

    //*****************************//
    //*Datos en formato Json *//
    //*****************************//
    
    // Datos de provincias
    function obtenerPronvincias() {
        var uri = "app/jsons/provincias.json";
        return $http({ 
          url: uri, 
          method: "GET", 
          headers: { "Content-Type": "application/json" }, 
          isArray: true 
        });
    }

    // Datos de regiones
    function obtenerRegiones() {
        var uri = "app/jsons/regiones.json";
        return $http({ 
          url: uri, 
          method: "GET", 
          headers: { "Content-Type": "application/json" }, 
          isArray: true 
        });
    }
});