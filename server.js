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
var address = '127.0.0.1';
var port = 4200;
process.argv.forEach(function(val , index, array) {
    if (index == 2) {
        address = val;
    }
    if (index == 3) {
        port = val;
    }
});
server.listen(port, address);
console.log("Server listening on " + address +":" + port);
console.log("Press enter to shutdown the server");

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
    //console.log('received data:', util.inspect(text));
    shutdown();
});

var waitingClients = [];
var uuid = require('node-uuid');
var clients = {};
var games = [];
io.on('connection', function(client) {
    console.log("Client connected");
    client.on('identity' , function(data) {
        var uuid = data.value;
        if ( newClient(uuid)) {
            enterNewGame(this);
        } else {
            var oldClient = clients[uuid];
            clients[uuid] = this;
            if ( !reEnterGame(uuid , this , oldClient)) {
                enterNewGame(this);
            }
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
    console.log("Number of games " + games.length);
}


//TODO
// Clean up all server resources.
process.on('SIGTERM',function() {
    console.log("Asked to stop nicely");
    for ( var key in clients) {
        clients[key].disconnect(true);
    }
    games.forEach(function(game) {
        game.shutDown();
    });
    io.close();
    process.exit(0);
});

function shutdown() {
    console.log("Asked to stop nicely");
    for ( var key in clients) {
        clients[key].disconnect(true);
    }
    games.forEach(function(game) {
        game.shutDown();
    });
    io.close();
    process.exit(0);
}
