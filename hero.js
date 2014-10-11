

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
	var tile = board.tiles[y][x]
	if(tile.type != "Unoccupied"){
		return [{tile: tile, distance: distance}]
	} else {
		if (tile.subType == "Bones"){
			return [{tile: tile, distance: distance}]
		}
		var xa = x + compass[compass[direction].sides[0]].x;
		var ya = y + compass[compass[direction].sides[0]].y;
		var xb = x + compass[compass[direction].sides[1]].x;
		var yb = y + compass[compass[direction].sides[1]].y;
		return []
			.concat(look(direction, board, {x:x, y:y}, distance + 1))
			.concat(look(direction, board, {x:xa, y:ya}, distance + 2))
			.concat(look(direction, board, {x:xb, y:yb}, distance + 2))
	}
}

function look(){
	return dedupe(look2.apply(null, arguments))
}

function examine(hero, features){
	var desire = 0;
	var health = hero.health;
	var mines = hero.mineCount + 1;
	features.forEach(function(feature){
		var base = 0;
		var tile = feature.tile;
		var distance = feature.distance;
		switch(tile.type){
			case 'HealthWell':
				base = (100 - health) * 2
				break;		
			case 'DiamondMine':
				if(!tile.owner || tile.owner.team !== hero.team){
					if(health > 60){
						base = 50 / mines
					}
				}
				break;
			case 'Hero':
				if(tile.team == hero.team){ 
					// Teammate
					if(health > 40 && tile.health < 100){
						base = tile.health / health * 100
					}
				} else { 
					// Enemy
					if(health > 40){
						base = health / tile.health * 150
					}
				}
				break;
			case 'Unoccupied':
				if(tile.subType == 'Bone'){
					base = 20
				}
		}
		desire += base/distance;
	})
	return desire / (features.length/3);
}

module.exports = function(game, helpers){
	var hero = game.activeHero;
	choices = [];
	for (var direction in compass){
		choices.push({direction: direction, desire: examine(hero,
			look(direction, game.board, {x: hero.distanceFromLeft, y: hero.distanceFromTop})
		)})
	}
	choices.sort(function(choice1, choice2){ 
		return choice2.desire - choice1.desire
	})
	
	return choices[0].direction
}
