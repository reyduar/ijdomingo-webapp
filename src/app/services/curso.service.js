angular.module('app').factory('CursoService', function CursoService($http, __env, $localStorage) {

    var service = {
        obtenerCursos: obtenerCursos,
        guardarCurso: guardarCurso,
        editarCurso: editarCurso,
        borrarCurso: borrarCurso,
    };

    return service;


    function getAuthHeader() {
        return { "Accept": "application/json", "Content-Type": "application/json", Authorization: $localStorage.token };
    }

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
        var uri = __env.apiUrl + 'curso/editar/' + id;
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
            headers: getAuthHeader()
        }).then(function (response) {
            return response;
        });
    }
});