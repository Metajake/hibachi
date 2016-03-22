var Game = function () {},
	timeObj = {
		beatCount: 0,
		bpm: 857,
		timeOfBeat: 0
	}

Game.prototype = {
	init: function(){
		this.qualityNumbers = [100,200,325,500]
		this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"]
	},
	update_counter: function(){
		timeObj.beatCount ++
		timeObj.timeOfBeat = this.stageTimer.ms
	},	
	
	compare_timing: function(){
		this.myBeatTime = this.stageTimer.ms;
		this.difference = timeObj.timeOfBeat - this.timeOfHit;
		this.difference = Math.abs(this.beatTime - this.myBeatTime);
		if(this.difference == 0){
			this.timeQuality = this.qualityNames[0]
		}else if(this.difference < this.qualityNumbers[0]){
			this.timeQuality = this.qualityNames[1]
		}else if (this.difference < this.qualityNumbers[1]){
			this.timeQuality = this.qualityNames[2]		
		}else if( this.difference < this.qualityNumbers[2]){
			this.timeQuality = this.qualityNames[3]
		}else if(this.difference < this.qualityNumbers[3]){
			this.timeQuality = this.qualityNames[4]
		}else{
			this.timeQuality = this.qualityNames[5]
		}
	},	
	add_controls: function(){
		controls.chop.onDown.add(this.compare_timing, this)
		controls.mince.onDown.add(this.compare_timing, this)
	},
	begin_rhythm: function(){
		this.stageTimer = game.time.create(false);
		this.stageTimer.loop(timeObj.bpm, this.update_counter, this)
		this.stageTimer.start()
		music.play()
	},
	preload: function () {
		music.stop()
		game.load.image('chickenLeg', '../assets/img/chicken_leg.png')
    },
	
    create: function () {
		make_sky_bg();

		this.add_controls();
		
		this.begin_rhythm();
	},
	
	render: function(){
		game.debug.text('Elapsed seconds: ' + this.stageTimer.ms, 32, 32);
		game.debug.text('Beat Count: ' + timeObj.beatCount, 32, 64);
		game.debug.text('Time Of Beat: ' + timeObj.timeOfBeat, 32, 96);
		game.debug.text('Time Of Hit: ' + this.timeOfHit, 32, 128);
		game.debug.text('Difference: ' + this.difference, 32, 160);
		game.debug.text('My Beat Quality: ' + this.timeQuality, 32, 192);
	}
};