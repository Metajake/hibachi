var Game = function () {};

Game.prototype = {
	init: function(){
		this.qualityNumbers = [music.bpm * .02, music.bpm * .1,music.bpm * .2,music.bpm * .30,music.bpm * .50];
		this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
		this.beatCount = 0;
		this.nextBeat = music.bpm;
		this.nextBeatPrediction = music.bpm;
		this.midBeat = music.bpm / 2;
		this.quarterMidBeat = 0;
		this.beatList = [1000,2000,3000,4000,5000,6000];
		this.indicator = {};
		this.actor = {}
	},
	update_counter: function(){
		this.beatCount ++
		this.nextBeat = this.quarterBeatTimer.ms + music.bpm;
	},	
	predict_next_beat: function(){
		this.indicator.flash.start()
		this.quarterMidBeat = this.stageTimer.ms;
		this.nextBeatPrediction = this.stageTimer.ms + (music.bpm / 2);
	},
	compare_timing: function(event){
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
	action_one:function(actingOn, launchFrame){
		this.launchFrame = launchFrame;
		this.compare_timing()
		log(this.timeQuality)
		if(this.timeQuality == "POOR" || this.timeQuality == "BAD" || this.timeQuality == "OK"){
			actingOn.animations.play('fall',6);
		} else{
			actingOn.animations.play('pose',5);			
		}
		actingOn.animations.currentAnim.onComplete.add(function(){
			actingOn.animations.play('idle',3);
			actingOn.animations.currentAnim.setFrame(launchFrame,true);
		});
	},
	add_controls: function(){
		controls.space.onDown.add(pause_game);
		controls.step.onDown.add(step_game);
		controls.pose.onDown.add(function(){this.action_one(this.dancer,this.dancer.animations.currentFrame.index)}, this);
		controls.chop.onDown.add(this.compare_timing, this)
		controls.mince.onDown.add(this.compare_timing, this)
		controls.dice.onDown.add(this.compare_timing, this)
		controls.slice.onDown.add(this.compare_timing, this)
		controls.mix.onDown.add(this.compare_timing, this)
		controls.flip.onDown.add(this.compare_timing, this)
	},
	
	add_graphics: function(){
		sky_bg();
		this.ground = game.add.sprite(0, 500, 'sidewalk');

		this.indicator.sprite = game.add.sprite(125,0,'chickenLeg')
		this.indicator.sprite.smoothed = false;
		this.indicator.sprite.scale.setTo(10,10)
		this.indicator.sprite.alpha = 0;
		this.indicator.flash = make_flash(this.indicator.sprite);
		
		
		this.dancer = game.add.sprite(500,420,'dancer')		
		this.dancer.smoothed = false;
		this.dancer.scale.setTo(4.5,4.5)
		this.dancer.animations.add('idle',[0,1,2,1]);
		this.dancer.animations.add('pose',[5,6,7,7,7,7,8,9]);
		this.dancer.animations.add('fall',[11,12,13,14,14,14,14,15,16,17]);
		this.dancer.animations.play('idle',3,true)
	},

	begin_rhythm: function(){

		this.quarterBeatTimer.loop(music.bpm, this.update_counter, this)
		this.quarterBeatMidTimer.loop(music.bpm, this.predict_next_beat, this)
		
		this.stageTimer.start()
		// this.predict_next_beat()
		
		game.time.events.add(music.bpm, function(){
			this.beatCount ++;
			this.quarterBeatTimer.start()
		}, this)
		
		game.time.events.add(music.bpm / 2, function(){
			this.predict_next_beat()
			this.quarterBeatMidTimer.start()
		}, this);
		
		
		music.track.play()
	},

	preload: function () {
		music.track.stop();
		this.stageTimer = game.time.create(false);
		this.quarterBeatTimer = game.time.create(false);
		this.quarterBeatMidTimer = game.time.create(false);
    },
	
    create: function () {
		game.stage.disableVisibilityChange = true;
		
		this.add_graphics();
		
		this.add_controls();
		
		this.begin_rhythm();
	},
	
	update: function(){
		// this.compare_timing() //FOR DEBUGGING
	},
	
	render: function(){
		game.debug.text('Elapsed seconds: ' + this.stageTimer.ms, 32, 32);
		game.debug.text('Time of Beat: ' + this.nextBeat, 32, 64);
		game.debug.text('Quarter Mid (beat): ' + this.quarterMidBeat, 32, 96);
		game.debug.text('Next Beat Prediction: ' + this.nextBeatPrediction, 32, 128);
		game.debug.text('My Time of Beat: ' + this.myBeatTime, 32, 160);
		game.debug.text('Difference: ' + this.difference, 32, 192);
		game.debug.text('Beat Count: ' + this.beatCount, 32, 224);
		game.debug.text('My Beat Quality: ' + this.timeQuality, 32, 256);
		game.debug.text('Current Animation Frame: ' + this.dancer.animations.currentFrame.index, 32, 288);
		game.debug.text('Starting Animation From Frame: ' + this.launchFrame, 32, 320);
	}
};