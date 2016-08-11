/**
 * Created by solevi on 4/7/16.
 */

/**
 * Enum for possible states of game
 * @readonly
 * @enum {String}
 */
var GameStates = {
   /** State where players can edit spells */
   spell_creation : "Spell Creation",
   match          : "Match",
   cancel         : "Cancel",
   match_finished : "Match Finished"
};
if ( typeof window === 'undefined') {
    module.exports = GameStates;
}
