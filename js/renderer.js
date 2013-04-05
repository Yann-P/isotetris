var Renderer = Class.extend({

	init: function(game) {
		this.game = game;
		this.setup();
	},

	setup: function() {
		var $game = $('#game');
		$game.css({
			'left': $(window).width()/2  - $game.width()/2,
			'top':  $(window).height()/2 - $game.height()/2
		});
	},

	drawPiece: function(piece) { // A TESTER avec les updates
		var grid   = piece.grids[piece.orientation],
			width  = grid[0].length,
			height = grid.length,
			selector = ".piece[data-id='" + piece.id + "']",
			pieceExists = $(selector).length == 1,
			$piece = pieceExists ? $(selector) : $('<div></div>'); // Cas où la pièce existe déjà et on veut la mettre à jour

		if(!pieceExists) { // Création si elle n'existait pas
			$piece.addClass('piece').attr({
				'data-id': piece.id,
				'data-type': piece.type,
				'data-x': piece.position.x,
				'data-y': piece.position.y
			}).prependTo('#game');
		}

		$piece.css({ // Application / MàJ du style dans les deux cas
			'left': piece.position.x * 16,
			'top':  piece.position.y * 16,
			'width': width * 16,
			'height': height * 16
		});

		$piece.empty(); // On vide la pièce des tiles si c'est une MàJ
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				if(grid[y][x])
					this.drawTile($piece, x, y, piece.color);
			}
		}
	},

	drawTile: function($piece, x, y, color) {
		var $tile = $('<div></div>').addClass('tile').attr({
			'data-x': x,
			'data-y': y
		});
		$tile.css({
			'left': x * 16,
			'top': y * 16,
			'background-color': color
		}).appendTo($piece);
	}

});