(function () {
    'use strict';

    angular
        .module('app')
        .factory('LobbyService', Service);

    function Service($http, $q) {
        var service = {};

        service.JoinLobby = JoinLobby;
        service.HostGame = HostGame;

        return service;

        function JoinLobby(vm, username, users, games) {
            var vm = vm;
            $http.post("/api/lobby/join")
                .then(function(addressObj){
                    connectToLobby(addressObj.data)
                })
                .catch(function(err){

                });

            function connectToLobby(lobby) {
                // Socket connection
                service.players = users;
                service.games = games;
                service.username = username;
                var socket = io.connect("http://" + document.domain + ":" +  lobby.port);

                socket.on('connect', function() {
                    socket.emit('identity', username );
                });
                socket.on('lobby_state', function(lobby_state) {
                    service.players.length = 0;
                    service.games.length = 0;
                    lobby_state.games.forEach(function(game) {
                        service.games.push(game);
                    });
                    lobby_state.players.forEach(function(user) {
                       service.players.push(user);
                    });
                });
                socket.on('new_game', function(game) {
                   service.games.push(game);
                   vm.update();
                });
                socket.on('new_player',function(player){
                    service.players.push(player);
                    vm.update();
                });
                service.socket = socket;
            }
        }

        function HostGame(gameInfo) {
            service.socket.emit('host_game', gameInfo);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }
})();
