/*
	Graphical rendering using DOM elements.
*/
var Renderer = Class.extend({

	// Initialization
	init: function(game) {
		this.game = game;
		this.setup();
	},

	// Centers the #game div on the screen
	setup: function() {
		var $game = $('#game');
		$game.css({
			'left': $(window).width()/2  - $game.width()/2,
			'top':  $(window).height()/2 - $game.height()/2
		});
		this.drawZones();
		/*Temporaire: dessiner le centre*/
		$('<div></div>').css({'position':'absolute','top':624/2, 'left':624/2, 'height':1, 'width':1, 'background-color':'red'}).appendTo('#game');
		/*fin*/
		
	},

	drawZones: function() {
		for(var i = 0; i <= 19; i++) {
			var $zone = $('<div></div>');
			$zone.addClass('zone').css({
				'width':  ((i*2) + 1) * 16,
				'height': ((i*2) + 1) * 16,
				'top':    (19 - i)    * 16,
				'left':   (19 - i)    * 16 
			}).appendTo('#game');
		}
	},

	// Create a brick, or updates it if the .brick div was already placed.
	drawBrick: function(brick) {
		var grid   = brick.grids[brick.orientation],
			width  = grid[0].length,
			height = grid.length,
			selector = ".brick[data-id='" + brick.id + "']",
			brickExists = $(selector).length == 1,
			$brick = brickExists ? $(selector) : $('<div></div>'); // If the brick already exists, select it ; or create a new div

		if(!brickExists) {
			$brick.addClass('brick').attr({
				'data-id': brick.id,
				'data-type': brick.type,
				'data-x': brick.position.x,
				'data-y': brick.position.y
			}).prependTo('#game');
		}

		$brick.css({ // Both the update and the brick creation actions needs this
			'left': brick.position.x * 16,
			'top':  brick.position.y * 16,
			'width': width * 16,
			'height': height * 16
		});

		$brick.empty(); // Remove all tiles if there were already some in the .brick element
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				if(grid[y][x])
					this.drawTile($brick, x, y, brick.color);
			}
		}
	},

	// $container will be a .brick, except for the central tile.
	drawTile: function($container, x, y, color) {
		var $tile = $('<div></div>').addClass('tile').attr({
			'data-x': x,
			'data-y': y
		});
		$tile.css({
			'left': x * 16,
			'top': y * 16,
			'background-color': color
		}).appendTo($container);
	}

});