var utils = {
    centerGameObjects: function (objects) {objects.forEach(function (object) {object.anchor.setTo(0.5);});},
	flash: function() {
		a1 = game.add.tween(this.jam);
		a1.to({alpha:1},time.bpm/2).to({alpha:0},time.bpm/2).loop()
		a1.start()
	}
};

function log(toLog){
	console.log(toLog)
}

function pause_game(event){
	if(controls.space.altKey){
		if (game.stepping){
			game.disableStep()
		}else{
			game.enableStep()
			game.stepCount = 1;
		}
	}else{
		if (game.paused){
			game.paused = false;
		} else{
			game.paused = true;
		}
	}
}

function step_game(){
	if(game.stepping){
		game.step();
	}
}