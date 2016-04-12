/**
 * Created by solevi on 4/5/16.
 */
var Game = require("game-serverside/Game/Game.js");
var service = {};

service.initService = initService;
service.games = {};
function initService(io) {
    io.on('connection', function(socket) {
        console.log("Connected to game service");
        socket.on('enter_game', function(gameInfo, callback) {
            var gameUID = gameInfo.gameUID;
            var username = gameInfo.username;
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
            service.games[gameUID].claim(this, username);
            callback(null,"Success");
        });
        socket.on('quit_game', function(gameInfo) {
           var gameUID = gameInfo.gameUID;
           var username = gameInfo.username;
           if ( service.games[gameUID]) {
               service.games[gameUID].quit(username);
           }
        });
    });
    io.on('disconnect', function() {
        console.log("Disconnected from game server");
    });
}

module.exports = service;