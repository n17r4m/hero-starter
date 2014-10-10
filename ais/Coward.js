
// The "Coward"
// This hero will try really hard not to die.
var move = function(gameData, helpers) {
	return helpers.findNearestHealthWell(gameData);
}


// Export the move function here
module.exports = move;
