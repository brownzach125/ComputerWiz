var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var waitingClients = [];
var uuid = require('node-uuid');


// TODO Think about switching to mongoose
var service = {};

service.joinLobby = joinLobby;
service.initService = initService;

module.exports = service;

function joinLobby() {
    var deferred = Q.defer();
    if (!service.lobby) {
        service.lobby = new Lobby();
    }
    service.lobby.addUser(function(err) {
        if (err) deferred.reject(err);

        deferred.resolve({port:service.lobby.port});
    });
    return deferred.promise;
}

function initService(io, gameMap) {
    var lobby = new Lobby(io,gameMap);
}



function Lobby(io,gameMap) {
    this.gameMap = gameMap;
    this.io = io;
    this.players = [];
    this.games   =  [];
    this.sockets = {};
    var lobby = this;
    io.on('connection', function(client) {
        var that = this;
        client.on('identity', function(message) {
            lobby.players.push(message.username);
            lobby.sockets[message.username] = this;
            this.emit('lobby_state', {players: lobby.players, games: lobby.games});
            io.emit('new_player', message.username);
        });
        client.on('host_game', function(gameInfo){
            lobby.games.push(gameInfo);
            io.emit('new_game', gameInfo);
        });
        client.on('join_game', function(gameInfo){
            // Start game
            var gameUUID = uuid.v1();
            lobby.gameMap[gameUUID] = {holder:true};
            lobby.sockets[gameInfo.host].emit("start_game",{gameUID:gameUUID});
            lobby.sockets[gameInfo.otherPlayer].emit("start_game",{gameUID:gameUUID});
            // TODO fix this
            lobby.cancelGame(gameInfo);
        });
        client.on('cancel_game', function(gameInfo, callback) {
            var success = lobby.cancelGame(gameInfo);
            if ( success ) {
                callback(null,"Game canceled");
            }
        });
        client.on('disconnect', function() {
            console.log("Disconnected from lobby service");
        });
    });
}

Lobby.prototype.addUser = function(callback) {
      callback();
};

Lobby.prototype.cancelGame = function(gameInfo) {
    var index = this.findGameIndex(gameInfo.host);
    if (index >= 0) {
        var game = this.games[index];
        this.io.emit("cancel_game", game);
        this.games.splice(index,1);
        return true;
    }
    return false;
};

Lobby.prototype.findGameIndex = function(host) {
    var index;
    for (var i =0; i < this.games.length; i++) {
        if (this.games[i].host == host) {
            index = i;
            break;
        }
    }
    return index;
};

// TODO add to schema
// TODO Make name unique
