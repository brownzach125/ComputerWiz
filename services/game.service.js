/**
 * Created by solevi on 4/5/16.
 */
var uuid = require('node-uuid');
var Game = require("game-serverside/Game/Game.js");
var Training = require("game-serverside/Game/Training.js");
var service = {};

service.initService = initService;
service.shutDown = shutDown;
service.games = {};
service.training = {};


/*
    The game service is responsible for creating new games,
    as well as helping new sockets for existing games connect their game.
 */

function initService(io) {
    io.on('connection', function(socket) {
        console.log("Connected to game service");
        socket.on('enter_game', function(gameInfo, callback) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
            var training = gameInfo.training;
            var constructor = Game;
            // Create a holder for training
            // So joining a training will fit patter of joining game
            if (training) {
                gameUID = uuid.v1();
                service.games[gameUID] = {holder:true};
                constructor = Training;
            }

            var game = joinOrCreateGame(this, gameUID, username, constructor, callback);
            // Start game( will do nothing if already started)
            if (game) {
                game.startGame();
            }
        });

        // TODO games should be repsonsible for this behavior
        socket.on('quit_match', function(gameInfo) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
            if ( gameUID) {
                if ( service.games[gameUID]) {
                    service.games[gameUID].quitMatch(username);
                }
            } else {
                if (service.training[username]) {
                    service.training[username].quitMatch(username);
                }
            }
        });

        // TODO games should be responisble for this behavior
        socket.on('quit_game', function(gameInfo) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
            var training = gameInfo.training;
            if (!training) {
                // kill training
                if ( service.games[gameUID]) {
                    service.games[gameUID].quit();
                }
                service.games[gameUID] = null;
            } else {
                // kill game
                if (service.training[username]) {
                    service.training[username].quit();
                }
                service.training[username] = null;
            }
        });
    });
    io.on('disconnect', function() {
        console.log("Disconnected from game server");
    });
}

function joinOrCreateGame(socket, gameUID, username, Type, callback) {
    console.log("Player " + username + " entered game or training");
    if ( !service.games[gameUID] ) {
        if ( typeof(callback) === 'function' ) {
            callback("No such game");
        }
        return null;
    }
    if (service.games[gameUID].holder ) {
        service.games[gameUID] = new Type(service.games, gameUID);
    }
    service.games[gameUID].claim(socket, username);
    callback(null,"Success");
    return service.games[gameUID];
}

function shutDown() {
    for ( var key in service.games) {
        service.games[key].shutDown();
    }
    for ( var key in service.training) {
        service.training[key].shutDown();
    }
}

module.exports = service;