/*
	Graphical rendering using DOM elements.
*/
var Renderer = Class.extend({

	// Initialization
	init: function(game) {
		this.game = game;
	},

	// Makes the active side of the game brighter.
	highlightActiveSide: function() {
		$('.side').removeClass('bright');
		$('.side[data-side="' + this.game.activeSide + '"]').addClass('bright');
	},

	// Triggers the view.
	triggerGameIsometric: function() {
		$('#game').toggleClass('isometric');
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
				'data-side': brick.side,
				'data-x': brick.position.x,
				'data-y': brick.position.y
			}).appendTo('#game');
		}

		$brick.css({ // Both the update and the brick creation actions needs this
			'left': (brick.position.x - 4) * 16,
			'top':  (brick.position.y - 4) * 16,
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
	},

	// Makes shake the controlled brick.
	setAnimatedBrick: function(brick) {
		var $brick = $('.brick[data-id="' + brick.id + '"]');
		$('.brick').removeClass('animated');
		$brick.addClass('animated');
	},

	// Erases tiles from completed lines.
	eraseTile: function(brick, position) {
		var $brick = $('.brick[data-id="' + brick.id + '"]');
		$brick.find('.tile[data-x="' + (position.x) + '"][data-y="' + (position.y) + '"]').each(function() {
			$(this).fadeOut();
		});
	},

	openGameMenu: function() {
		$('#game-menu').show();
	},

	closeGameMenu: function() {
		$('#game-menu').hide();
	},

	// Clears the game zone for new game.
	clear: function() {
		this.closeGameMenu();
		$('.zone, .brick').remove();
		$('.side').removeClass('bright');
	}

});