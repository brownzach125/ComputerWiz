var config = require('config.json');
var express = require('express');
var router = express.Router();

var Spell = require('models/spell.model');
// routes
router.get('/', getAllUserSpells);
router.post('/',createSpell);
router.put('/:_id', updateSpell);

function getAllUserSpells(req,res) {
    var userId = req.user.sub;
    Spell.getByUserId(userId)
        .then(function(spells){
            res.send(spells);
        })
        .catch(function(err){
            res.status(400).send(err);
        });
}

function createSpell(req,res) {
    var spell = req.body;
    Spell.findOneAndUpdate({userId:spell.userId, slot:spell.slot} , spell,{upsert:true,new:true},function(err,nspell) {
        if (err) res.status(400).send(err);

        res.status(200).send(nspell);
    });
}

function updateSpell(req,res) {
    var spell = req.body;
    Spell.findOneAndUpdate({userId:spell.userId, slot:spell.slot} , spell,{upsert:true,new:true},function(err,nspell) {
        if (err) res.status(400).send(err);

        res.status(200).send(nspell);
    });
}

module.exports = router;
