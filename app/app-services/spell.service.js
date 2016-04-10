(function () {
    'use strict';

    angular
        .module('app')
        .factory('SpellService', Service);

    function Service($http, $q) {
        var service = {};
        service.GetUserSpells = GetUserSpells;
        service.SaveSpell = SaveSpell;

        return service;

        function GetUserSpells(userId) {
            return $http.get('/api/users/' + userId + "/spells").then(handleSuccess,handleError);
        }

        function SaveSpell(userId, spell) {
            spell.userId =userId;
            if (spell._id) {
                // Save existing spell
                return $http.put('/api/users/' + userId + "/spells/" +spell._id, spell).then(handleSuccess,handleError);
            }
            else {
                // Create spell
                return $http.post('/api/users/' + userId + "/spells", spell).then(handleSuccess,handleError);
            }
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
