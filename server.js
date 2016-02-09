/*jshint node: true*/ 

// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Game   = require('./Game.js');


app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('');

server.listen(4200 , '0.0.0.0');

var waitingClients = [];
var uuid = require('node-uuid');
var clients = {};
var games = [];
io.on('connection', function(client) {
    console.log("Client connected");
    client.on('identity' , function(data) {
        var uuid = data.value;
        if (! newClient(uuid) ) {
            console.log("Old Client has sent identity");
            var oldClient = clients[uuid];
            clients[uuid] = this;
            if (!reEnterGame(uuid , this , oldClient) ) {
                enterNewGame(this);
            }
        } else {
            enterNewGame(this);
        }
    });
});

function newClient(uuid) {
    if ( uuid in clients ) {
        return false;
    } else {
        return true;
    }
}

function reEnterGame( uuid , client , oldClient ) {
    client.wizardName = oldClient.wizardName;
    client.game = oldClient.game;
    client.uid = uuid;
    if ( client.game && client.game.running ) {
        client.game.reconnect(client);
        return true;
    }
    else {
        return false;
    }
}

function enterNewGame(client) {
    client.uid = uuid.v1();
    client.emit('identity' , {value : client.uid});
    clients[uuid] = client;
    if ( waitingClients.length === 0) {
        client.wizardName = 'redWizard';
    }
    if ( waitingClients.length == 1 ) {
        client.wizardName ='blueWizard';
    }
    waitingClients.push(client);
    clients[client.uid] = client;
    console.log("uid " + client.uid);
    if ( waitingClients.length == 2 ) {
        var game = new Game(waitingClients);
        waitingClients[0].game = game;
        waitingClients[1].game = game;
        game.init();
        game.start();
        games.push(game);
        waitingClients = [];
    }
    console.log("Number of games " + games.length);
}

