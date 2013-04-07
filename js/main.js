/*
	Isotetris
	Yann Pellegrini, 2013
*/

$(document).ready(function() {

	window.game = null;

	var $game = $('#game'),
		$menu = $('#menu');

	$('#game, #menu').css({
		'left': $(window).width()/2  - 624 / 2,
		'top':  $(window).height()/2 - 624 / 2
	});

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

    $('#menu .navigation').click(function() {
    	showSlide($(this).attr('data-link'));
    });
    $('#start').click(function() {
		newGame();
	});
	$('#triggerIso').click(function() {
		game.renderer.triggerGameIsometric();
	});
	showSlide('main');
});