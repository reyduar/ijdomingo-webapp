angular.module('app').factory('PeriodoService', function PeriodoService($http, __env) {

    var service = {
        obtenerPeriodos: obtenerPeriodos,
        guardarPeriodo: guardarPeriodo,
        editarPeriodo: editarPeriodo,
        borrarPeriodo: borrarPeriodo,
        getPeriodoActivo: getPeriodoActivo
    };

    return service;


    function obtenerPeriodos() {
        var uri = __env.apiUrl + 'periodos';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    };

    function getPeriodoActivo() {
        var uri = __env.apiUrl + 'periodo/activo';
        return $http({
            url: uri,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    };

    function guardarPeriodo(body) {
        var uri = __env.apiUrl + 'periodo/agregar';
        return $http({
            url: uri,
            method: "POST",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    };

    function editarPeriodo(id, body) {
        var uri = __env.apiUrl + 'periodo/editar/' + id;
        return $http({
            url: uri,
            method: "PUT",
            data: body,
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    };

    function borrarPeriodo(id) {
        var uri = __env.apiUrl + 'periodo/borrar/' + id;
        return $http({
            url: uri,
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            return response;
        });
    };
});