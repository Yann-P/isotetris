var Game = Class.extend({

	init: function() {
		this.renderer = new Renderer(this);
		this.pieces = [];
		this.started = false;
		this.setup();
	},

	// Place la pièce initiale
	setup: function() {
		this.insertInitialPiece();
		this.start();
	},

	// Attention, ce n'est pas une loop de rendu comme canvas !
	mainLoop: function() {
		var self = this;
		if(!self.started) return;
		self.nextPiecesPositions();

		setTimeout(function() {
			self.mainLoop();
		}, 100);
	},

	// Applique la gravité aux pièces.
	nextPiecesPositions: function() { // BUG : ne prend pas en compte toutes les pieces
		console.log(this.pieces); // Correct
		for(var i = 0; i < this.pieces.length; i++) { // N'itère pas assez de fois si on ajoute des pièces !!
			var piece = this.pieces[i];
			if(piece.side === false) return; // Ignore la pièce centrale
			switch(piece.side) {
				case 0: piece.position.y++; break;
				case 1: piece.position.x--; break;
				case 2: piece.position.y--; break;
				case 3: piece.position.x++; break;
			}
			console.log(piece.position.x)
			piece.render();
		}
	},

	insertPiece: function(type, position, orientation, side) {
		var id = this.pieces.length,
			piece = new Piece(this, id, type, position, orientation, side);
		this.pieces.push(piece);
	},

	insertPieceFrom: function(type, side) {
		var position, orientation;
		switch(side) {
			case 0:  position = { x: 20, y: 0  }; orientation = 0; break;
			case 1:  position = { x: 40, y: 20 }; orientation = 1; break;
			case 2:  position = { x: 20, y: 40 }; orientation = 2; break;
			case 3:  position = { x: 0,  y: 20 }; orientation = 3; break;
		}
		this.insertPiece(type, position, orientation, side);
	},

	insertInitialPiece: function() {
		var type = Math.floor(Math.random() * Data.pieces.length),
			orientation = Math.floor(Math.random() * 4),
			position = { x: 20, y: 20 };
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