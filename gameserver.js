/**
 * Created by solevi on 4/5/16.
 */
require('rootpath')();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var config = require('config.json');


var gameService  = require('./services/game.service');
gameService.initService(io.of('/game'));
var lobbyService = require('./services/lobby.service');
lobbyService.initService(io.of('/lobby'), gameService.games);

mongoose.connect(config.database, {user:config.user, pass:config.pass});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

app.use('/api/lobby', require('./controllers/api/lobby.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
server.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});