(function() {
    'use strict';

    angular
        .module('app')
        .controller('Game.IndexController', Controller);

    function Controller(UserService, SpellService, socket, $state, $scope, ngDialog) {
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


        $scope.$on("$destroy", function(){
            socket.emit('quit_game', {gameUID:vm.gameUID, username:vm.user.username});
            socket.disconnect();
            ngDialog.close();
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
                if (!message.ready)
                    waitingOnOpponent();
            })
        }
        function goToSpell() {
            socket.emit("game_state", {state: GameStates.spell_creation}, function(err, message) {
                if (err)
                   console.log("shit");
                // TODO do something while waiting
                if (!message.ready)
                    waitingOnOpponent();
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
            });
        };
        socketCallbacks.game_state = function(message) {
            var gameState = message.state;
            ngDialog.close();
            switch(gameState) {
                case GameStates.spell_creation: {
                    vm.game_state = GameStates.spell_creation;
                    $state.go('game.spells');
                    break;
                }
                case GameStates.match: {
                    vm.game_state = GameStates.match;
                    $state.go("game.match");
                    break;
                }
            }
        };
        socketCallbacks.game_over = function() {
            window.localStorage.setItem('gameUID',"");
            ngDialog.close();
            $state.go('lobby');
        };
        socketCallbacks.game_info = function(gameInfo) {
            vm.wizardName = gameInfo.wizardName;
            vm.opponent   = gameInfo.opponent;
        };
        socketCallbacks.match_finished = function(results) {
            vm.game_state = GameStates.match_finsihed;
            openMatchOverDialog(results);
        };

        // Dialogs
        function openMatchOverDialog(results) {
            var options = {
                template: 'modals/matchOver.html',
                className: 'ngdialog-theme-default',
                controller: "Modal.MatchOverController",
                controllerAs: 'vm',
                data: {
                    results : results,
                    wizardName : vm.wizardName,
                    opponent : vm.opponent
                }
            };
            ngDialog.openConfirm(options)
                .then(function (data) {
                    if (data.rematch) {
                        console.log("Starting Rematch");
                        goToSpell();
                    }
                })
                .catch(function (reason) {
                    console.log(reason);
                    $state.go("lobby");
                });
        }

        function waitingOnOpponent() {
            var options = {
                template: 'modals/waitingOnOpponent.html',
                className: 'ngdialog-theme-default',
            };
            ngDialog.openConfirm(options).then(waitingOnOpponentCallback);
        }

        function waitingOnOpponentCallback() {
            socket.emit("game_state",{ state: GameStates.cancel} );
            switch(vm.game_state) {
                case GameStates.match_finished: {
                    $state.go("lobby");
                }
            }
        }
    }
})();
