var config = require('config.json');
var express = require('express');
var router = express.Router();
var lobbyService = require('services/lobby.service');

// routes
router.post('/join', JoinLobby);


module.exports = router;

function JoinLobby(req,res) {
    //var userId = req.user.sub;
    lobbyService.joinLobby()
        .then(function (lobby) {
            res.send(lobby);
        })
        .catch(function (err) {
            res.sendStatus(404);
        });
}
