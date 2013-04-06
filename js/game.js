/*
	Game
*/
var Game = Class.extend({

	init: function() {
		this.renderer = new Renderer(this);
		this.bricks = [];
		this.grid = [];
		this.started = false;
		this.ticks = 0;
		this.activeSide = false; // Controlled by mouse in main.js
		this.updateInterval = 500;
		this.setup();
	},

	// Places the initial tile and starts the game
	setup: function() {
		this.insertInitialBrick();
		this.start();
		this.updateGrid();
	},

	// Updates the game
	mainLoop: function() {
		if(!this.started) return;
		this.nextBricksPositions();
		if(this.ticks % 8 == 0) {
			this.insertRandomBrick();
		}
		
		this.ticks++;
		setTimeout(function(self) {
			self.mainLoop();
		}, this.updateInterval, this);
	},

	moveBySide: function(side, direction) {
		var brick = this.getFistBrickBySide(side);
		if(!brick) return;
		brick.move(direction);
	},

	rotateBySide: function(side, direction) {
		var brick = this.getFistBrickBySide(side);
		if(!brick) return;
		brick.rotate();
	},

	getFistBrickBySide: function(side) {
		for(var i = 0; i < this.bricks.length ; i++) {
			var brick = this.bricks[i];
			if(brick.side == side && !brick.fixed && brick.side !== false)
				return brick;
		}
		return false;
	},

	// Returns completed rows (by distance from central tile)
	checkRows: function() {
		var rowsDone = [];
		for(var distance = 1; distance <= 19; distance++) { // Distance from central tile
			var count = 0,
				tilesToExplore = this.getAllCoordsForARow(distance);
			for(var i = 0; i < tilesToExplore.length; i++) {
				var x = tilesToExplore[i][0],
					y = tilesToExplore[i][1];
				if(this.grid[y][x] != -1)
					count++;
			}
			if(count == tilesToExplore.length) {
				console.log('Ligne complétée :' + distance);
				rowsDone.push({
					distance: distance,
					tiles: tilesToExplore
				});
			}
		}
		return rowsDone;
	},

	// Applies gravity to bricks
	nextBricksPositions: function() {
		for(var i = 0; i < this.bricks.length; i++) {
			var brick = this.bricks[i],
				newPosition = {
					x: brick.position.x,
					y: brick.position.y
				};
			if(brick.side === false || brick.fixed) // Ignores the central tile and placed tiles.
				continue;
			switch(brick.side) {
				case 0: newPosition.y = brick.position.y + 1; break;
				case 1: newPosition.x = brick.position.x - 1; break;
				case 2: newPosition.y = brick.position.y - 1; break;
				case 3: newPosition.x = brick.position.x + 1; break;
			}

			if(brick.hasPartOut(newPosition, false)) { // Out of grid range !
				alert('Oops.\nVous avez perdu une brique ?');
				return this.stop();
			}
			if(!brick.collides(newPosition)) {
				brick.updatePosition(newPosition);
			}
			else {
				brick.fixed = true;
				this.updateGrid();
				if(brick.hasPartOut(brick.position, true)) {
					brick.highlight();
					alert('Oops.\nÀ court de place ?');
					return this.stop();
				}
				var rowsDone = this.checkRows();
				if(rowsDone.length > 0) {
					for(var i = 0; i < rowsDone.length; i++) { // For each row done
						var rowDone = rowsDone[i];
						for(var t = 0; t < rowDone.tiles.length; t++) { // For each tile of the row
							this.removeTile({
								x: rowDone.tiles[t][0],
								y: rowDone.tiles[t][1]
							});
						}
					}
				}
			}
		}
	},

    // Removes tile of a completed line.
	removeTile: function(position) {
		var brick = this.bricks[this.grid[position.y][position.x]],
			brickPosition = {
				x: position.x - brick.position.x,
				y: position.y - brick.position.y
			};
		console.log(position.x);
		$('.brick[data-id="'+brick.id+'"]').find('.tile[data-x="'+(brickPosition.x)+'"][data-y="'+(brickPosition.y)+'"]').each(function() {
			$(this).remove();
		});
		this.grid[position.y][position.x] = -1;
		brick.grids[brick.orientation][brickPosition.y][brickPosition.x] = 0;
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

	insertRandomBrick: function(position) {
		var type = Math.floor(Math.random() * Data.bricks.length),
			side = Math.floor(Math.random() * 4);
		this.insertBrickFrom(type, side);
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
			case 1:  position = gridPosition({ x: 39, y: 19  }); orientation = 1; break;
			case 2:  position = gridPosition({ x: 19, y: 39  }); orientation = 2; break;
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

	// Starts main loop
	start: function() {
		this.started = true;
		this.mainLoop();
	},

	// Ends main loop
	stop: function() {
		this.started = false;
	},

	// Gets all coords of the tiles needed to complete a row.
	getAllCoordsForARow: function(distance) { // Distance from central tile
		var result = [],
			start = 23 - distance, // 23, 23 is the coords of the central tile
			end = 23 + distance;
		for(var x = start + 1; x <= end; x++) {
			result.push([x, start]);
		}
		for(var y = start + 1; y <= end; y++) {
			result.push([end, y]);
		}
		for(var x = start; x <= end - 1; x++) {
			result.push([x, end]);
		}
		for(var y = start; y <= end - 1; y++) {
			result.push([start, y]);
		}
		return result; // [[x, y], [x, y],...]
	}

});