(function() {
    'use strict';

    angular
        .module('app')
        .controller('Training.IndexController', Controller);

    function Controller(UserService, SpellService, socket, $state,$scope) {
        var vm = this;
        vm.user = null;
        vm.spells = null;
        vm.gameUID = null;
        vm.socket = socket;

        initController();
        // public functions
        vm.goToMatch = goToMatch;
        vm.goToSpell = goToSpell;
        vm.quitGame = quitGame;

        $scope.$on('$destroy' , function() {
            socket.emit('quit_game', {username:vm.user.username, training:true });
            socket.disconnect();
        });

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                SpellService.GetUserSpells(vm.user._id).then(function(spells) {
                    vm.spells = spells;
                    setupSocket();
                });
            });
        }

        function setupSocket() {
            socket.connect('/game');
            for ( var key in socketCallbacks) {
                socket.on(key, socketCallbacks[key]);
            }
        }

        function goToMatch() {
            socket.emit("game_state", { state: GameStates.match},function(err, message) {
                if (err)
                    console.log("shit");
                // TODO do something while waiting
            })
        }

        function goToSpell() {
            socket.emit("game_state", {state: GameStates.spell_creation}, function(err, message) {
                if (err)
                    console.log("shit");
                // TODO do something while waiting
            });
        }

        function quitGame() {
            window.localStorage.setItem('gameUID',"");
            socket.emit('quit_training' , {gameUID: vm.gameUID, username: vm.user.username});
            $state.go('lobby');
        }

        var socketCallbacks =  {};
        socketCallbacks.connect = function() {
            socket.emit('enter_game', {gameUID: vm.gameUID, username:vm.user.username, training:true}, function(err, message) {
                if (err ) {
                    $state.go("lobby");
                    return;
                }
                socket.emit('claim', {username: vm.user.username});
            });
        };
        socketCallbacks.game_state = function(message) {
            var gameState = message.state;
            switch(gameState) {
                case GameStates.spell_creation: {
                    $state.go('training.spells');
                    break;
                }
                case GameStates.match: {
                    $state.go("training.match");
                    break;
                }
            }
        };
        socketCallbacks.game_over = function() {
            window.localStorage.setItem('gameUID',"");
        }
    }
})();
