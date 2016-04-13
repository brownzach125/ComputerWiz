(function() {
    'use strict';

    angular
        .module('app')
        .controller('Game.IndexController', Controller);

    function Controller(UserService, SpellService, socket, $state, $scope) {
        var vm = this;
        vm.user = null;
        vm.spells = null;
        vm.gameUID = null;
        vm.socket = socket;

        var GameStates = {};
        GameStates.spell_creation = 0;
        GameStates.match = 1;

        initController();
        // public functions
        vm.goToMatch = goToMatch;
        vm.goToSpell = goToSpell;
        vm.quitGame = quitGame;
        $scope.$on("$destroy", function(){
            socket.emit('quit_game', {gameUID:vm.gameUID, username:vm.user.username});
        });


        function initController() {
            vm.gameUID = window.localStorage.getItem('gameUID');
            if ( !vm.gameUID) {
                $state.go('lobby');
            }
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
            socket.emit('quit_game' , {gameUID: vm.gameUID, username: vm.user.username});
            $state.go('lobby');
        }

        var socketCallbacks =  {};
        socketCallbacks.connect = function() {
            socket.emit('enter_game', {gameUID: vm.gameUID, username:vm.user.username}, function(err, message) {
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
                    $state.go('game.spells');
                    break;
                }
                case GameStates.match: {
                    $state.go("game.match");
                    break;
                }
            }
        };
        socketCallbacks.game_over = function() {
            window.localStorage.setItem('gameUID',"");
            $state.go('lobby');
        }




    }
})();
