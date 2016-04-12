/**
 * Created by solevi on 4/5/16.
 */
//var Game = require("game-serverside/Game/Game.js");
var Training = require("game-serverside/Game/Training.js");
var service = {};

service.initService = initService;

service.games = {};
function initService(io) {
    io.on('connection', function(socket) {
        console.log("Connected to training service");
        socket.on('enter_training', function(gameInfo, callback) {
            var username = gameInfo.username;
            console.log("Player " + username + " entered training");
            if (!service.games[username]) {
                service.games[username] = new Training();
            }
            service.games[username].claim(this, username);
            callback(null,"Success");
        });
        socket.on('quit_game', function(gameInfo) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
            if ( service.games[username]) {
                service.games[username].quit(username);
            }
            service.games[username] = null;
        });
    });
    io.on('disconnect', function() {
        console.log("Disconnected from game server");
    });
}

module.exports = service;