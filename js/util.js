/*
	Common useful functions.
*/

// KeyCodes.
var keys = {
	enter: 13,
	shift: 16,
	ctrl: 17,
	esc: 27,
	space: 32,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	a: 64
};

// The viewport begin at x, y = 4 on the grid array. So tile at 0,0 is in fact at 4,4
var gridPosition = function(position) {
	return {
		x: position.x + 4,
		y: position.y + 4
	};
};

// Clones an object.
var cloneObject = function(object) {
	return JSON.parse(JSON.stringify(object));
};