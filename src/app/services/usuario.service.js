angular.module('app').factory('UsuarioService', function UsuarioService($http, __env) {

    var service = {
        obtenerUsuarios: obtenerUsuarios,
        guardarUsuario: guardarUsuario,
        editarUsuario: editarUsuario,
        borrarUsuario: borrarUsuario,
    };

    return service;


    // Metodo para traer todos los cursos 
    function obtenerUsuarios() {
        var uri = __env.apiUrl + 'usuarios/lista';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para guardar curso
    function guardarUsuario(body) {
        var uri = __env.apiUrl + 'usuario/agregar';
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
    function editarUsuario(id, body) {
        var uri = __env.apiUrl + 'usuario/editar/' + id;
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
    function borrarUsuario(id) {
        var uri = __env.apiUrl + 'usuario/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }
});