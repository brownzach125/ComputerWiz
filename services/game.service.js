/**
 * Created by solevi on 4/5/16.
 */
var Game = require("game-serverside/Game/Game.js");
var Training = require("game-serverside/Game/Training.js");
var service = {};

service.initService = initService;
service.shutDown = shutDown;
service.games = {};
service.training = {};

function initService(io) {
    io.on('connection', function(socket) {
        console.log("Connected to game service");
        socket.on('enter_game', function(gameInfo, callback) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
            var training = gameInfo.training;
            if (training) {
                joinTraining(this, username, callback);
            }
            else {
                joinGame(this, gameUID, username,callback);
            }
        });
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

function joinTraining(socket, username,callback) {
    console.log("Player " + username + " entered training");
    if (!service.training[username]) {
        service.training[username] = new Training();
    }
    service.training[username].claim(socket, username);

    callback(null,"Success");
}

function joinGame(socket, gameUID, username,callback) {
    console.log("Player " + username + " entered game");
    if ( !service.games[gameUID] ) {
        if ( typeof(callback) === 'function' ) {
            callback("No such game");
        }
        return;
    }
    if (service.games[gameUID].holder ) {
        service.games[gameUID] = new Game();
    }
    service.games[gameUID].claim(socket, username);
    callback(null,"Success");
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