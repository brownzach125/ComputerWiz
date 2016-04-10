/**
 * Created by solevi on 4/7/16.
 */


var GameStates = {};
GameStates.spell_creation = 0;
GameStates.match = 1;

if ( typeof window === 'undefined') {
    module.exports = GameStates;
}
