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

function signal (signaling) {
	log("hello");
	document.getElementById('signal').innerHTML = signaling;
}