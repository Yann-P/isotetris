var Piece = Class.extend({

	init: function(game, id, type, position, orientation, side) {
		this.game = game;
		this.id = id;
		this.type = type;
		this.position = position;
		this.orientation = orientation;
		this.side = side;
		this.grids  = Data.pieces[type].grids;
		this.color = Data.pieces[type].color;
		this.render();
	},

	render: function() {
		this.game.renderer.drawPiece(this);
	},

	rotate: function() {
		if(this.orientation == 3) this.orientation = 0
		else this.orientation++;
	}

});