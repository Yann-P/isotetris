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
		this.insertInitialBrick();
		this.start();
		this.updateGrid();
	},

	// Every 500ms, updates the game
	mainLoop: function() {
		var self = this;
		if(!this.started) return;
		this.nextBricksPositions();
		this.ticks++;
		setTimeout(function() {
			self.mainLoop();
		}, 300);
	},

	// Applies gravity to bricks
	nextBricksPositions: function() {
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

			if(!brick.collides(newPosition))
				brick.updatePosition(newPosition);
		}
		this.updateGrid();
	},

	// Updates the grid of tiles placed on the game
	updateGrid: function() {
		var size = 47;		 			 // Because the grid needs space out of the viewport (which has a 39 tile size)
		for(var x = 0; x < size; x++) {  // New blank grid
			this.grid[x] = []; 				 
			for(var y = 0; y < size; y++) {
				this.grid[x][y] = -1;
			}
		}
		for(var i = 0; i < this.bricks.length; i++) { 
			var brick     = this.bricks[i],
				brickGrid = brick.grids[brick.orientation];
			for(var x = 0; x < brickGrid[0].length; x++) {
				for(var y = 0; y < brickGrid.length; y++) {
					if(brickGrid[y][x]) // Fill the grid with brick id when there is a tile at (x, y)
						this.grid[y + brick.position.y][x + brick.position.x] = brick.id;
				}
			}
		}
	},

	// Inserts a brick on the game
	insertBrick: function(type, position, orientation, side) {
		var id = this.bricks.length,
			brick = new Brick(this, id, type, position, orientation, side);
		this.bricks.push(brick);
	},

	// Inserts a brick from a side of the grid
	insertBrickFrom: function(type, side) {
		var position, orientation;
		switch(side) {
			case 0:  position = gridPosition({ x: 19, y: -4  }); orientation = 0; break;
			case 1:  position = gridPosition({ x: 40, y: 19  }); orientation = 1; break;
			case 2:  position = gridPosition({ x: 19, y: 40  }); orientation = 2; break;
			case 3:  position = gridPosition({ x: -4, y: 19  }); orientation = 3; break;
		}
		this.insertBrick(type, position, orientation, side);
	},

	// Inserts the central brick.
	insertInitialBrick: function() {
		var type = Math.floor(Math.random() * Data.bricks.length),
			orientation = Math.floor(Math.random() * 4),
			size = { // Used to center the brick as good as possible using its size
				width:  Data.bricks[type].grids[orientation][0].length,
				height: Data.bricks[type].grids[orientation].length
			},
			position = { x: 23 - Math.floor(size.width / 2), y: 23 - Math.floor(size.height / 2) };
		this.insertBrick(type, position, orientation, false);
	},

	start: function() {
		this.started = true;
		this.mainLoop();
	},

	stop: function() {
		this.started = false;
	}

});