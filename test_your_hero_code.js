/*

If you'd like to test your hero code locally,
run this code using node (must have node installed).

Please note that you DO NOT need to do this to enter javascript
battle, it is simply an easy way to test whether your new hero 
code will work in the javascript battle.

To run:

  -Install node
  -Run the following in your terminal:

    node test_your_hero_code.js

  -If you don't see any errors in your terminal, the code works!

*/

//Get the helper file and the Game logic
var helpers = require('./helpers.js');
var Game = require('./game_logic/Game.js');

//Get my hero's move function ("brain")
var heroMoveFunction = require('./hero.js');


var bots = [
	require("./ais/SafeDiamonds"),
	require("./ais/SelfishDiamonds"),
	require("./ais/Coward"),
	require("./ais/CarefulAssasin"),
	require("./ais/UnwiseAssasin")
]


//Makes a new game with a 13x13 board
var game = new Game(13);

//Add a health well in the middle of the board
game.addHealthWell(6,6);

//Add diamond mines on either side of the health well
game.addDiamondMine(3,3);
game.addDiamondMine(9,9);
game.addImpassable(3,9);
game.addImpassable(9,3);

// Add Walls around the edges
var tileTypes = ["Impassable", "HealthWell", "DiamondMine"];
for(var i = 0; i < 13; i++){
	var tile = tileTypes[i%3]
	game["add" + tile](i, 0);
	game["add" + tile](0, i);
	game["add" + tile](i, 12);	
	game["add" + tile](12, i);
}




//Add your hero in the top left corner of the map (team 0)
[1,2,3,4,5].forEach(function(i){
	game.addHero(2, 2+i, 'MyHero', 0);
	game.addHero(10, 5+i, 'Enemy' + i, 1);
})


console.log('About to start the game!  Here is what the board looks like:');

//You can run game.board.inspect() in this test code at any time
//to log out the current state of the board (keep in mind that in the actual
//game, the game object will not have any functions on it)
game.board.inspect();

//Play a practice game
var turnsToPlay = 1250;

var i = 0
var aiTurn = 0;
var running = setInterval(function(){
	if(turnsToPlay--){
		i++;
		var hero = game.activeHero;
		var direction;
		if (hero.name === 'MyHero') {

		  //Ask your hero brain which way it wants to move
		  direction = heroMoveFunction(game, helpers);
		} else {	
		  direction = bots[aiTurn++ % bots.length](game, helpers);
		}
		console.log('-----');
		console.log('Turn ' + i + ':');
		console.log('-----');
		console.log(hero.name + ' tried to move ' + direction);
		console.log(hero.name + ' owns ' + hero.mineCount + ' diamond mines')
		console.log(hero.name + ' has ' + hero.health + ' health')
		console.log(game.moveMessage)
		game.handleHeroTurn(direction);
		game.board.inspect();
	
	
	} else {
		clearInterval(running)
	}
}, 100)

