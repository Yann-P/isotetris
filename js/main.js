/*
	Isotetris
	Yann Pellegrini, 2013
*/

$(document).ready(function() {

	window.game = new Game();

	$('.side').mouseover(function() {
		var side = parseInt($(this).data('side'));
		game.activeSide = side;
		$('.side').stop().css('opacity', 0)
		$(this).css('opacity', 1);
	});

	$(document).dblclick(function(event) {
		game.insertBrick(0, gridPosition({
			x: Math.floor((event.clientX-$('#game').position().left)/16),
			y: Math.floor((event.clientY-$('#game').position().top)/16)
		}), 0, false);
	}).live('keydown', function(event) {
		if([keys.down, keys.up, keys.left, keys.right, keys.space].indexOf(event.keyCode) != -1) {
			event.preventDefault();
		}
		switch(event.keyCode) {
			case keys.space:
				game.rotateBySide(game.activeSide);
				break;
			case keys.up:
				if(game.activeSide == 3 || game.activeSide == 1) game.moveBySide(game.activeSide, 2);
				if(game.activeSide == 2) game.moveBySide(game.activeSide, 2);
				break;
			case keys.right:
				if(game.activeSide == 0 || game.activeSide == 2) game.moveBySide(game.activeSide, 3);
				if(game.activeSide == 3) game.moveBySide(game.activeSide, 3);
				break;
			case keys.down:
				if(game.activeSide == 3 || game.activeSide == 1) game.moveBySide(game.activeSide, 0);
				if(game.activeSide == 0) game.moveBySide(game.activeSide, 0);
				break;
			case keys.left:
				if(game.activeSide == 0 || game.activeSide == 2) game.moveBySide(game.activeSide, 1);
				if(game.activeSide == 1) game.moveBySide(game.activeSide, 1);
				break;
		}
	});

});