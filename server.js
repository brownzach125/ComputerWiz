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

server.listen(4000 , '0.0.0.0');

var waitingClients = [];
var uuid = require('node-uuid');
var clients = {};
var games = [];
io.on('connection', function(client) {
    console.log("Client connected");
    client.on('identity' , function(data) {
        if ( data.value in clients ){
            console.log("Old client");
            // This client is already in a game
            var oldClient = clients[data.value];
            var game = oldClient.game;
            var wizard = oldClient.wizardName;
            client.wizardName = wizard;
            client.game = game;
            if ( game && game.running ) {
                game.reconnect(client);
                return;
            }
            // Do what would have happened if new client
            // since their game is over
        }

        // This client is new add to new game
        client.uid = uuid.v1();
        client.emit('identity' , {value : client.uid});
        if ( waitingClients.length == 0) {
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
    });
});
