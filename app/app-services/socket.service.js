(function() {
    angular.module('app')
        .factory('socket', Service );

    function  Service ($rootScope) {
        var service = {};
        var socket;


        service.connect = connect;
        service.on = on;
        service.emit = emit;

        return service;

        function connect(namespace) {
            socket = io.connect(document.location.origin + namespace , {path:""});
        }

        function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
})();