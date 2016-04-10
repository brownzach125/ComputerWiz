(function() {
    'use strict';

    angular
        .module('app')
        .controller('Lobby.IndexController', Controller);

    function Controller(UserService, socket, $state) {
        var vm = this;

        vm.user = null;
        vm.players = [];
        vm.games = [];
        vm.isHosting = false;

        // public
        vm.hostGame = hostGame;
        vm.joinGame = joinGame;
        vm.cancelGame = cancelGame;

        initController();
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;

                setupSocket();
            });
        }
        function hostGame() {
            socket.emit("host_game", {host:vm.user.username});
            vm.isHosting = true;
        }
        function joinGame(index) {
            var game = vm.games[index];
            game.otherPlayer = vm.user.username;
            socket.emit("join_game",  game);
        }
        function cancelGame(index) {
            socket.emit("cancel_game", vm.games[index],
                function(err, message) {
                    vm.isHosting = false;
                });
        }

        function setupSocket() {
            // Socket Callback functions
            var socketCallbacks =  {};
            socketCallbacks.connect = function() {
                socket.emit('identity', {username:vm.user.username} );
            };
            socketCallbacks.lobby_state = function(state) {
                vm.players = [];
                vm.games = [];
                state.games.forEach(function(game) {
                    vm.games.push(game);
                });
                state.players.forEach(function(user) {
                    vm.players.push(user);
                });
            };
            socketCallbacks.new_game = function(game) {
                vm.games.push(game);
            };
            socketCallbacks.new_player = function(player) {
                vm.players.push(player);
            };
            socketCallbacks.cancel_game = function(game) {
                var index;
                for ( var i =0; i < vm.games.length; i++) {
                    if(vm.games[i].host == game.host) {
                        index = i;
                        break;
                    }
                }
                if ( index >= 0) {
                    vm.games.splice(index,1);
                }
            };
            socketCallbacks.start_game = function(game) {
                console.log("Start the game");
                window.localStorage.setItem('gameUID' , game.gameUID);
                $state.go('game');
            };

            socket.connect("/lobby");
            for ( var key in socketCallbacks) {
                socket.on(key, socketCallbacks[key]);
            }
        }
    }
})();
