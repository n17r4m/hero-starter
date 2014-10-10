
// The "Unwise Assassin"
// This hero will attempt to kill the closest enemy hero. No matter what.
var move = function(gameData, helpers) {
	var myHero = gameData.activeHero;
	if (myHero.health < 30) {
		return helpers.findNearestHealthWell(gameData);
	} else {
		return helpers.findNearestEnemy(gameData);
	}
};


// Export the move function here
module.exports = move;
