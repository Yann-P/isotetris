/*
	Isotetris
	Yann Pellegrini, 2013
*/

$(document).ready(function() {

	window.game = new Game();

	$('.side').mouseover(function() {
		var side = parseInt($(this).data('side'));
		game.setActiveSide(side);
		$('.side').stop().css('opacity', 0)
		$(this).css('opacity', 1);
	});

	$(document).click(function(event) {
		game.rotateActiveBrick();
	}).live('keydown', function(event) {
		if([keys.down, keys.up, keys.left, keys.right, keys.space].indexOf(event.keyCode) != -1) {
			event.preventDefault();
		}
		switch(event.keyCode) {
			case keys.up:
				if(game.activeSide == 3 || game.activeSide == 1) game.moveActiveBrick(2);
				if(game.activeSide == 2) 						 game.moveActiveBrick(2);
				break;
			case keys.right:
				if(game.activeSide == 0 || game.activeSide == 2) game.moveActiveBrick(3);
				if(game.activeSide == 3) 						 game.moveActiveBrick(3);
				break;
			case keys.down:
				if(game.activeSide == 3 || game.activeSide == 1) game.moveActiveBrick(0);
				if(game.activeSide == 0) 						 game.moveActiveBrick(0);
				break;
			case keys.left:
				if(game.activeSide == 0 || game.activeSide == 2) game.moveActiveBrick(1);
				if(game.activeSide == 1) 						 game.moveActiveBrick(1);
				break;
		}
	});

});