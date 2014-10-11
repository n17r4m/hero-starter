

var horiz = ["East", "West"]
var vert = ["North", "South"]
var compass = {
	North: {x:0, y:-1, sides: horiz}, 
	East: {x:1, y:0, sides: vert}, 
	South: {x:0, y:1, sides: horiz}, 
	West: {x:-1, y:0, sides: vert}
}


function dedupe(features){
	var visitedTiles = []
	return features.filter(function(spot){
		if(visitedTiles.indexOf(spot.tile) == -1){
			visitedTiles.push(spot.tile)
			return true
		} else { return false }
	})
}

function look2(direction, board, location, distance){
	distance = distance || 1;
	var x = location.x + compass[direction].x;
	var y = location.y + compass[direction].y;
	if(y < 0 || y >= board.tiles.length || x < 0 || x >= board.tiles[0].length){
		// OOB
		return [];
	}
	var tile = board.tiles[y][x]
	if(tile.type != "Unoccupied"){
		return [{tile: tile, distance: distance}]
	} else {
		var features = [];
		if (tile.subType == "Bones"){
			features.push({tile: tile, distance: distance})
		}
		var xa = x + compass[compass[direction].sides[0]].x;
		var ya = y + compass[compass[direction].sides[0]].y;
		var xb = x + compass[compass[direction].sides[1]].x;
		var yb = y + compass[compass[direction].sides[1]].y;
		return features
			.concat(look(direction, board, {x:x, y:y}, distance + 1))
			.concat(look(direction, board, {x:xa, y:ya}, distance + 1))
			.concat(look(direction, board, {x:xb, y:yb}, distance + 1))
		
	}
}

function look(){
	return dedupe(look2.apply(null, arguments))
}

function examine(hero, features){
	var desire = 0;
	var health = hero.health;
	var mines = hero.mineCount + 1;
	var enemies = 0;
	var teammates = 0;
	features.forEach(function(feature){
		var base = 0;
		var tile = feature.tile;
		var distance = feature.distance;
		switch(tile.type){
			case 'HealthWell':
				base = (100 - health)
				break;		
			case 'DiamondMine':
				if(!tile.owner || tile.owner.team !== hero.team){
					if(health > 50){
						base = 10
					}
				}
				break;
			case 'Hero':
				if(tile.team == hero.team){ 
					// Teammate
					teammates ++;
					if(health > 50 && tile.health < 100){
						base = tile.health / health * 100
					} 
				} else { 
					// Enemy
					enemies ++;
					if(health > 50){
						base = health / tile.health * 100
					}
				}
				break;
			case 'Unoccupied':
				if(tile.subType == 'Bone'){
					base = 5
				}
				break;
		}
		desire += base/distance;
	})
	
	return (desire);
}

function shuffle(o){
    for(var j, x, i = o.length; i; 
    	j = Math.floor(Math.random() * i), 
    	x = o[--i], 
    	o[i] = o[j], 
    	o[j] = x
    );
    return o;
};

var move = function(game, helpers){
	var hero = game.activeHero;
	
	if(hero.health <= 40){
		return helpers.findNearestHealthWell(game)
	}
	
	choices = [];
	for (var direction in compass){
		choices.push({direction: direction, desire: examine(hero,
			look(direction, game.board, {x: hero.distanceFromLeft, y: hero.distanceFromTop})
		)})
	}
	
	shuffle(choices).sort(function(choice1, choice2){ 
		return choice2.desire - choice1.desire
	})
	
	return choices[0].direction
}

module.exports = move;


