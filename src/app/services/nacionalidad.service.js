angular.module('app').factory('NacionalidadService', function NacionalidadService($http, __env) {

    var service = {
        obtenerNacionalidades: obtenerNacionalidades,
        guardarNacionalidad: guardarNacionalidad,
        editarNacionalidad: editarNacionalidad,
        borrarNacionalidad: borrarNacionalidad,
    };

    return service;


    // Metodo para traer todos las nacionalidades
    function obtenerNacionalidades() {
        var uri = __env.apiUrl + 'nacionalidades';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para guardar nacionalidad
    function guardarNacionalidad(body) {
        var uri = __env.apiUrl + 'nacionalidad/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para editar nacionalidad
    function editarNacionalidad(id, body) {
        var uri = __env.apiUrl + 'nacionalidad/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para borrar nacionalidad
    function borrarNacionalidad(id) {
        var uri = __env.apiUrl + 'nacionalidad/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }
});