/*
	Isotetris
	Yann Pellegrini, 2013
*/
window.game = null;

var newGame = function() {
	if(window.game)
		game.clear();
	window.game = new Game(0);
	$('#menu').hide();
	$('#game').show();
};

var showSlide = function(title) {
	$('#menu .slide').hide();
	$('#menu .slide[data-title="' + title + '"]').fadeIn();
};

var gameOver = function(cause) {
	game.clear();
	switch(cause) {
		case "out":
			titleScreen('gameover-out');
			break;
		case "space":
			titleScreen('gameover-space');
			break;
	}
}

var titleScreen = function(slide) {
	$('#game').hide();
	$('#menu').show();
	showSlide(slide ? slide : 'main');
};

$(document).ready(function() {
	
	$('#game, #menu').css({
		'left': $(window).width()/2  - 624 / 2,
		'top':  $(window).height()/2 - 624 / 2
	});

    $('#menu .navigation').click(function() {
    	showSlide($(this).attr('data-link'));
    });
    $('#start').click(function() {
		newGame();
	});
	$('#triggerIso').click(function() {
		game.renderer.triggerGameIsometric();
	});

	titleScreen();
});