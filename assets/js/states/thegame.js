var Game = function () {},
	timeObj = {
		bpm: 800
	}

Game.prototype = {
	init: function(){
		this.qualityNumbers = [timeObj.bpm * .02, timeObj.bpm * .1,timeObj.bpm * .2,timeObj.bpm * .30,timeObj.bpm * .50];
		this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
		this.beatCount = 0;
		this.nextBeat = timeObj.bpm;
		this.nextBeatPrediction = timeObj.bpm;
		this.midBeat = timeObj.bpm / 2;
		this.quarterMidBeat = 0;
		this.beatList = [1000,2000,3000,4000,5000,6000]
	},
	update_counter: function(){
		this.beatCount ++
		this.nextBeat = this.quarterBeatTimer.ms + timeObj.bpm;
	},	
	predict_next_beat: function(){
		this.quarterMidBeat = this.stageTimer.ms;
		this.nextBeatPrediction = this.stageTimer.ms + (timeObj.bpm / 2);
	},
	compare_timing: function(){
		this.myBeatTime = this.stageTimer.ms;
		this.difference = Math.abs(this.nextBeatPrediction - this.myBeatTime);
		if(this.difference < this.qualityNumbers[0]){
			this.timeQuality = this.qualityNames[0]
		}else if (this.difference < this.qualityNumbers[1]){
			this.timeQuality = this.qualityNames[1]
		}else if(this.difference < this.qualityNumbers[2]){
			this.timeQuality = this.qualityNames[2]		
		}else if(this.difference < this.qualityNumbers[3]){
			this.timeQuality = this.qualityNames[3]
		}else if(this.difference < this.qualityNumbers[4]){
			this.timeQuality = this.qualityNames[4]
		}else{
			this.timeQuality = this.qualityNames[5]
		}
	},	
	add_controls: function(){
		controls.space.onDown.add(pause_game);
		controls.step.onDown.add(step_game);
		controls.chop.onDown.add(this.compare_timing, this)
		controls.mince.onDown.add(this.compare_timing, this)
		controls.dice.onDown.add(this.compare_timing, this)
		controls.slice.onDown.add(this.compare_timing, this)
		controls.mix.onDown.add(this.compare_timing, this)
		controls.flip.onDown.add(this.compare_timing, this)
		
	},

	begin_rhythm: function(){

		this.quarterBeatTimer.loop(timeObj.bpm, this.update_counter, this)
		this.quarterBeatMidTimer.loop(timeObj.bpm, this.predict_next_beat, this)
		
		this.stageTimer.start()
		// this.predict_next_beat()
		
		game.time.events.add(timeObj.bpm, function(){
			this.beatCount ++;
			this.quarterBeatTimer.start()
		}, this)
		
		game.time.events.add(timeObj.bpm / 2, function(){
			this.predict_next_beat()
			this.quarterBeatMidTimer.start()
		}, this);
		
		
		music.play()
	},

	preload: function () {
		music.stop();
		game.load.image('chickenLeg', '../assets/img/chicken_leg.png');
		this.stageTimer = game.time.create(false);
		this.quarterBeatTimer = game.time.create(false);
		this.quarterBeatMidTimer = game.time.create(false);
    },
	
    create: function () {
		make_sky_bg();

		this.add_controls();
		
		this.begin_rhythm();
	},
	
	update: function(){
		// this.compare_timing() //FOR DEBUGGING
	},
	
	render: function(){
		game.debug.text('Elapsed seconds: ' + this.stageTimer.ms, 32, 32);
		game.debug.text('Beat Count: ' + this.beatCount, 32, 64);
		game.debug.text('Time of Beat: ' + this.nextBeat, 32, 96);
		game.debug.text('Quarter Mid (beat): ' + this.quarterMidBeat, 32, 128);
		game.debug.text('Next Beat Prediction: ' + this.nextBeatPrediction, 32, 160);
		game.debug.text('My Time of Beat: ' + this.myBeatTime, 32, 192);
		game.debug.text('Difference: ' + this.difference, 32, 224);
		game.debug.text('My Beat Quality: ' + this.timeQuality, 32, 256);
	}
};