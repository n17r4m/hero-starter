
// The "Careful Assassin"
// This hero will attempt to kill the closest weaker enemy hero.
var move = function(gameData, helpers) {
	var myHero = gameData.activeHero;
	if (myHero.health < 50) {
		return helpers.findNearestHealthWell(gameData);
	} else {
		return helpers.findNearestWeakerEnemy(gameData);
	}
};

// Export the move function here
module.exports = move;
