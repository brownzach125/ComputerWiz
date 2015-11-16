// app.js
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

server.listen(4200);


var clients = [];
var games = [];
io.on('connection', function(client) {
    console.log('Client connected...');
    clients.push(client);
    if ( clients.length == 2) {
        var game = new Game(clients);
        game.init();
        game.start();
        games.push(game);
        clients = [];
    }
});

function createFunction(data) {
    console.log(player.x);
    player.createSpell(data);
    player.castSpell(data.slot);
    console.log(player.x);
}

