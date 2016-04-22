/**
 * Created by solevi on 4/19/16.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('Spells.SpellBookController', Controller);

    function Controller($scope) {
        var vm = this;
        vm.SpellBook = SpellBook;
        vm.selectedSpell = null;
        vm.selectedSpell = SpellBook.castFireBall;

        vm.selectSpell = selectSpell;

        function selectSpell(spell) {
           vm.selectedSpell = spell;
        }
    }
})();
