(function() {
    angular.module('app')
        .factory('socket', Service );

    function  Service ($rootScope) {
        var service = {};
        var socket;


        service.connect = connect;
        service.on = on;
        service.emit = emit;
        service.disconnect = disconnect;

        return service;

        function disconnect() {
            socket.disconnect();
            socket = null;
        }

        function connect(namespace) {
            if (socket) {
                console.log("Socket already connected!!!!!");
                throw Error;
            }
            socket = io.connect(document.location.origin + namespace , {path:""});
            console.log("Made A new connection");

            socket.on("disconnect", function() {
               console.log("Disconnection");
            });
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