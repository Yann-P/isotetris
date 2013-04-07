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
    	if(window.game)
    		game.clear();
    	window.game = new Game(0);
    }

    $('#start').click(function() {
		newGame();
	});

	$('#triggerIso').click(function() {
		game.renderer.triggerGameIsometric();
	});
});