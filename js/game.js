/*
	Game
*/
var Game = Class.extend({

	// Initialization
	init: function() {
		this.renderer = new Renderer(this);
		this.bricks = [];
		this.grid = [];
		this.started = false;
		this.ticks = 0;
		this.setup();
	},

	// Places the initial tile and starts the game
	setup: function() {
		this.insertInitialPiece();
		this.start();
		this.updateGrid();
	},

	// Every 500ms, updates the game
	mainLoop: function() {
		var self = this;
		if(!this.started) return;
		this.nextPiecesPositions();
		this.ticks++;
		setTimeout(function() {
			self.mainLoop();
		}, 500);
	},

	// Applies gravity to bricks
	nextPiecesPositions: function() {
		for(var i = 0; i < this.bricks.length; i++) {
			var brick = this.bricks[i],
				newPosition = {
					x: brick.position.x,
					y: brick.position.y
				};
			if(brick.side === false) 
				continue; // Ignores the central tile
			switch(brick.side) {
				case 0: newPosition.y = brick.position.y + 1; break;
				case 1: newPosition.x = brick.position.x - 1; break;
				case 2: newPosition.y = brick.position.y - 1; break;
				case 3: newPosition.x = brick.position.x + 1; break;
			}

			brick.updatePosition(newPosition);
		}
		this.updateGrid();
	},

	// Updates the grid of tiles placed on the game
	updateGrid: function() {
		for(var x = 0; x < 39; x++) { // New blank grid
			this.grid[x] = [];
			for(var y = 0; y < 39; y++) {
				this.grid[x][y] = 0;
			}
		}
		for(var i = 0; i < this.bricks.length; i++) {
			var brick = this.bricks[i],
				brickGrid = brick.grids[brick.orientation];
			for(var x = 0; x < brickGrid[0].length; x++) {
				for(var y = 0; y < brickGrid.length; y++) {
					if(brickGrid[y][x])
						this.grid[y+brick.position.y][x+brick.position.x] = 1;
				}
			}
		}
		console.log(JSON.stringify(this.grid));
	},

	// Inserts a brick on the game
	insertPiece: function(type, position, orientation, side) {
		var id = this.bricks.length,
			brick = new Brick(this, id, type, position, orientation, side);
		this.bricks.push(brick);
	},


	insertPieceFrom: function(type, side) {
		var position, orientation;
		switch(side) {
			case 0:  position = { x: 19, y: 0  }; orientation = 0; break;
			case 1:  position = { x: 40, y: 19 }; orientation = 1; break;
			case 2:  position = { x: 19, y: 40 }; orientation = 2; break;
			case 3:  position = { x: 0,  y: 19 }; orientation = 3; break;
		}
		this.insertPiece(type, position, orientation, side);
	},

	insertInitialPiece: function() {
		var type = Math.floor(Math.random() * Data.bricks.length),
			orientation = Math.floor(Math.random() * 4),
			position = { x: 19, y: 19 };
		this.insertPiece(type, position, orientation, false);
	},

	start: function() {
		this.started = true;
		this.mainLoop();
	},

	stop: function() {
		this.started = false;
	}

});