/*
	Isotetris
	Yann Pellegrini, 2013
*/

$(document).ready(function() {

	var $game = $('#game');
	$game.css({
		'left': $(window).width()/2  - $game.width()/2,
		'top':  $(window).height()/2 - $game.height()/2
	});

	window.game = null;

	var newGame = function() {
    	if(window.game) {
    		game.clear();
    		$(document).die('click keydown');
    		$('.side').die('mouseover');
    	}
    	window.game = new Game();

    	$(document).live('click', function() {
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

		$('.side').live('mouseover', function() {
			var side = parseInt($(this).data('side'));
			game.setActiveSide(side);
			$('.side').removeClass('bright');
			$(this).addClass('bright');
		});
    }

    $('#start').click(function() {
		newGame();
	});

	$('#triggerIso').click(function() {
		game.renderer.triggerGameIsometric();
	});
});