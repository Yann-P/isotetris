/*
	Tetris bricks
*/
var Brick = Class.extend({

	init: function(game, id, type, position, orientation, side) {
		this.game = game;
		this.id = id;
		this.type = type;
		this.position = position;
		this.orientation = orientation;
		this.side  = side;
		this.grids = cloneObject(Data.bricks[type].grids);
		this.color = Data.bricks[type].color;
		this.fixed = false; // When collides, can't move anymore.
		this.render();
	},

	// Graphical rendering of the brick
	render: function() {
		this.game.renderer.drawBrick(this);
	},

	// For debug
	highlight: function() {
		$('.brick[data-id="'+this.id+'"]').css('border', '2px solid red');
	},

	// 90° rotation
	rotate: function() {
		var newOrientation = this.orientation;
		newOrientation = (this.orientation == 3) ? 0 : this.orientation + 1;
		if(this.hasPartOut(this.position, false, newOrientation) || this.collides(this.position, newOrientation)) 
			return false;
		this.orientation = newOrientation;
		this.render();
	},

	// Moves a brick in the opposite of a direction (side)
	move: function(direction) {
		var newPosition = {
			x: this.position.x,
			y: this.position.y
		};
		switch(direction) {
			case 0: newPosition.y++; break;
			case 1: newPosition.x--; break;
			case 2: newPosition.y--; break;
			case 3: newPosition.x++; break;
		}
		if(this.hasPartOut(newPosition, true) || this.collides(newPosition))
			return false;
		this.updatePosition(newPosition);
	},

	// Checks if, for a brick at a position, a tile or all the brick will be out of game zone.
	hasPartOut: function(position, viewport, orientation) { // Viewport = true => return true if just out of viewport.
		var grid   = this.grids[orientation ? orientation : this.orientation],
			width  = grid[0].length,
			height = grid.length;
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				if(!viewport) {
					if(y + position.y >= 47 || y + position.y < 0 || x + position.x >= 47 || x + position.x < 0) 
						return true;
				}
				else {
					if(y + position.y >= 43 || y + position.y < 4 || x + position.x >= 43 || x + position.x < 4) 
						return true;
				}
			}
		}
		return false;
	},

	// Checks if brick at a position will collide with any grid element but itself.
	collides: function(position, orientation) {
		var grid   = this.grids[orientation ? orientation : this.orientation],
			width  = grid[0].length,
			height = grid.length;
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				var gridState = this.game.grid[y + position.y][x + position.x];
				if(grid[y][x] && gridState != this.id && gridState != -1) {
					return true;
				}
			}
		}
		return false;
	},

	// Set new position
	updatePosition: function(position) {
		this.position = position;
		this.game.updateGrid();
		this.render();
	}

});