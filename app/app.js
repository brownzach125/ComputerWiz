(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'myDirectives', 'ui.ace', 'ngDialog'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider,ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: false,
            closeByDocument:false,
            closeByEscape: false
        });



        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            .state('lobby', {
                url: '/lobby',
                templateUrl: 'lobby/index.html',
                controller: "Lobby.IndexController",
                controllerAs: 'vm',
                data: {activeTab: 'lobby'}
            })
            .state('spells', {
                url: '/spells',
                templateUrl: 'spells/index.html',
                controller: "Spells.IndexController",
                controllerAs: 'vm',
                data: {activeTab: 'spells'}
            })
            .state('training', {
                url: '/training',
                templateUrl: 'training/index.html',
                controller: "Training.IndexController",
                controllerAs: 'vm',
                data: {activeTab:'training'}
            })
            .state('training.spells', {
                url: '/spells',
                templateUrl: 'spells/index.html',
                controller: "Spells.IndexController",
                controllerAs: 'vm',
                data: {activeTab:'training'}
            })
            .state('training.match', {
                url: '/match',
                templateUrl: 'match/match.html',
                controller: "Match.IndexController",
                controllerAs: 'vm',
                data: {activeTab:'training'}
            })
            .state('game', {
                url: '/game',
                templateUrl: 'game/index.html',
                controller: 'Game.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'game'}
            })
            .state('game.match', {
                url: '/match',
                templateUrl: 'match/index.html',
                controller: 'Match.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'game'}
            })
            .state('game.spells', {
                url: '/spells',
                templateUrl: 'spells/index.html',
                controller: "Spells.IndexController",
                controllerAs: 'vm',
                data: {activeTab:'game'}
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the gameserver.js
    $(function () {
        // get JWT token from gameserver.js
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();