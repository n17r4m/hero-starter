
var emotes = {
	blitzing: function(gameData, helpers) {
		var enemyDirection = helpers.findNearestEnemy(gameData)
		if (enemyDirection){
			return enemyDirection;
		} else {
			return emotes.passive(gameData, helpers)
		}
	},
	aggressive: function(gameData, helpers) {
		var enemyDirection = helpers.findNearestWeakerEnemy(gameData)
		if (enemyDirection){
			return enemyDirection;
		} else {
			return emotes.passive(gameData, helpers)
		}
	},	
	passive: function(gameData, helpers) {
		var mineDirection = helpers.findNearestNonTeamDiamondMine(gameData)
		if (mineDirection){
			return mineDirection;
		} else {
			return emotes.drunk(gameData, helpers)
		}
	},
	scared: function(gameData, helpers) {
		return helpers.findNearestHealthWell(gameData)
	},
	helpful: function(gameData, helpers) {
		var teammateDirection = helpers.findNearestTeamMember(gameData)
		if(teammateDirection){
			return teammateDirection;
		} else {
			return emotes.passive(gameData, helpers)
		}
	},
	drunk: function(gameData, helpers){
		var choices = ['North', 'South', 'East', 'West'];
		return choices[Math.floor(Math.random()*4)];
	}
}



function getEmoState(gameData, helpers){
	var hero = gameData.activeHero;
	
	var healthWell = healthWellStats(gameData, helpers)
	var teammate = teammateStats(gameData, helpers)	
	var mine = mineStats(gameData, helpers)	
	
	
	if (hero.health >= 60 && teammate.health <= 80 && teammate.distance <= 3) {
		return emotes.helpful
	}

	if (hero.health <= 80 && healthWell.distance <= 1) {
		return emotes.scared
	}
	
	if (hero.health >= 80 && mine.distance <= 1) {
		return emotes.passive
	}
	
	switch (true){
		case hero.health <= 60: return emotes.scared;
		// case hero.health <= 60: return emotes.passive;
		// case hero.health <= 80: return emotes.helpful;
		case hero.health <= 80: return emotes.aggressive;
		default: return emotes.blitzing;
	}
}


var move = function(game, helpers) {
	return getEmoState(game, helpers)(game, helpers)
};



function healthWellStats(game, helpers){
	var hero = game.activeHero
	var healthWellStats = helpers.findNearestObjectDirectionAndDistance(
		game.board, hero, function(tile) {
    if (tile.type === 'HealthWell') {
      return true;
    }
  });
  return {
  	distance: healthWellStats.distance,
  	direction: healthWellStats.direction
  }
}

function teammateStats(game, helpers){
	var hero = game.activeHero
	var teammateStats = helpers.findNearestObjectDirectionAndDistance(
		game.board, hero, function(tile) {
    if (tile.type === 'Hero' && tile.team === hero.team) {
      return true;
    }
  });
  return {
  	health: teammateStats.health,
  	distance: teammateStats.distance,
  	direction: teammateStats.direction
  }
}

function mineStats(game, helpers){
	var hero = game.activeHero
	var mineStats = helpers.findNearestObjectDirectionAndDistance(
		game.board, hero, function(tile) {
		if (tile.type === 'DiamondMine') {
      if (tile.owner) {
        return tile.owner.id !== hero.id;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });
  return {
  	distance: mineStats.distance,
  	direction: mineStats.direction
  }
}


module.exports = move;
