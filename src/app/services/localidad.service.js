angular.module('app').factory('LocalidadService', function LocalidadService($http, __env) {

    var service = {
        obtenerLocalidades: obtenerLocalidades,
        guardarLocalidad: guardarLocalidad,
        editarLocalidad: editarLocalidad,
        borrarLocalidad: borrarLocalidad,
        obtenerLocalidadesPorProvincia: obtenerLocalidadesPorProvincia
    };

    return service;


    // Metodo para traer todos los localidades 
    function obtenerLocalidades() {
        var uri = __env.apiUrl + 'localidades';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para traer localidades por provincia 
    function obtenerLocalidadesPorProvincia(provincia) {
        var uri = __env.apiUrl + '/localidad/buscar/provincia/'+provincia;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para guardar localidad
    function guardarLocalidad(body) {
        var uri = __env.apiUrl + 'localidad/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para editar localidad
    function editarLocalidad(id, body) {
        var uri = __env.apiUrl + 'localidad/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para borrar localidad
    function borrarLocalidad(id) {
        var uri = __env.apiUrl + 'localidad/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }
});