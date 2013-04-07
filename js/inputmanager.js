var InputManager = Class.extend({

	init: function(game) {
		this.game = game;
		this.keysPressed = [];
		this.keysFrozen  = [];
		this.unfreezeTimeout = null;
		this.setup();
	},

	setup: function() {
		this.startListening();
		this.mainLoop();
	},


	// When jQuery sends keydown event
	keydownCallback: function(keyCode) {
		if([keys.down, keys.up, keys.left, keys.right, keys.space].indexOf(keyCode) != -1) {
			event.preventDefault();
		}
		if(this.keysPressed.indexOf(keyCode) == -1) {
			this.keysPressed.push(keyCode); // Send one time immediately
			this.keysFrozen.push(keyCode);  // Prevents to send the action 2 times because of MainLoop
			this.game.keyCallback(keyCode);
			setTimeout(function(self) {
				var index = self.keysFrozen.indexOf(keyCode);
				if(index != -1)
					self.keysFrozen.splice(index, 1);
				else { // Not supposed to happen. If so, reset keysFrozen.
					self.keysFrozen = [];
				}
			}, 100, this);
		}
	},

	// When jQuery sends keyup event
	keyupCallback: function(keyCode) {
		var index = this.keysPressed.indexOf(keyCode);
		if(index != -1)
			this.keysPressed.splice(index, 1);
		else {	 // Not supposed to happen. If so, reset keysPressed.
			this.keysPressed = [];
		}
	},

	mainLoop: function() {
		if(this.game.started) {
			for(var i = 0; i < this.keysPressed.length; i++) { // For each key pressed
				var keyCode = this.keysPressed[i];
				if(this.keysFrozen.indexOf(keyCode) == -1) // If not frozen
					this.game.keyCallback(keyCode);
			}
		}
		setTimeout(function(self) {
			self.mainLoop();
		}, 100, this);
	},

	startListening: function() {
		var self = this;

		$(document).bind('click', function() {
			self.game.clickCallback();
		});
		$(document).bind('keydown', function(event) {
			self.keydownCallback(event.keyCode);
		});
		$(document).bind('keyup', function(event) {
			self.keyupCallback(event.keyCode);
		});

		$('.side').bind('mouseover', function() {
			self.game.setActiveSide(parseInt($(this).data('side')));
			self.game.renderer.highlightActiveSide();
		});
	},

	stopListening: function() {
		$(document).unbind('click keydown keyup');
		$('.side').unbind('mouseover');
	},

	clear: function() {
		this.stopListening();
	}


});