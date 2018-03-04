angular.module('app').factory('ProvinciaService', function ProvinciaService($http, __env) {

    var service = {
        obtenerProvincias: obtenerProvincias,
        guardarProvincia: guardarProvincia,
        editarProvincia: editarProvincia,
        borrarProvincia: borrarProvincia,
        obtenerProvinciaPorId: obtenerProvinciaPorId
    };

    return service;


    // Metodo para traer todos las provincias 
    function obtenerProvincias() {
        var uri = __env.apiUrl + 'provincias';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para traer todos las provincias 
    function obtenerProvinciaPorId(id) {
        var uri = __env.apiUrl + 'provincia/buscar/'+id;
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para guardar curso
    function guardarProvincia(body) {
        var uri = __env.apiUrl + 'provincia/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para editar provincia
    function editarProvincia(id, body) {
        var uri = __env.apiUrl + 'provincia/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }

    // Metodo para borrar provincia
    function borrarProvincia(id) {
        var uri = __env.apiUrl + 'provincia/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    }
});