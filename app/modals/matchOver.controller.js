(function() {
    'use strict';

    angular
        .module('app')
        .controller('Modal.MatchOverController', Controller);

    function Controller($scope) {
        var vm = this;
        vm.wizardName = $scope.ngDialogData.wizardName;
        vm.opponent = $scope.ngDialogData.opponent;
        vm.results = $scope.ngDialogData.results;
        vm.winner   = vm.wizardName == vm.results.winner;


        // public functions
        vm.rematch = rematch;
        vm.backToLobby = backToLobby;

        function rematch() {
            $scope.confirm({rematch:true});
        }

        function backToLobby() {
            $scope.closeThisDialog();
        }

    }
})();
