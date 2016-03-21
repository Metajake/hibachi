var Game = function () {};

Game.prototype = {
	beatCount: 0,
	bpm: 857,
	timeOfBeat: 0,
	
	update_counter: function(){
		this.beatCount ++
		this.timeOfBeat = this.stageTimer.ms
	},	
	
	compare_timing: function(){
		this.timeOfHit = this.stageTimer.ms;
		this.difference = this.timeOfBeat - this.timeOfHit;
	},	
	
	preload: function () {
		music.stop()
		game.load.image('chickenLeg', '../assets/img/chicken_leg.png')
    },
	
    create: function () {
		make_sky_bg();

		chop = game.input.keyboard.addKey(Phaser.Keyboard.W);
		chop.onDown.add(this.compare_timing, this)
		mince.onDown.add(this.compare_timing, this)
		
		// BEAT LOOP
		this.stageTimer = game.time.create(false);
		this.stageTimer.loop(this.bpm, this.update_counter, this)
		this.stageTimer.start()
		music.play()
	},
	
	render: function(){
		game.debug.text('Elapsed seconds: ' + this.stageTimer.ms, 32, 32);
		game.debug.text('Beat Count: ' + this.beatCount, 32, 64);
		game.debug.text('Time Of Beat: ' + this.timeOfBeat, 32, 96);
		game.debug.text('Time Of Hit: ' + this.timeOfHit, 32, 128);
		game.debug.text('Difference: ' + this.difference, 32, 160);
	}
};