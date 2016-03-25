var Game = function () {};
var beatCollection = {};
	beatCollection.beatCollector = [];
	beatCollection.wititQuarterBeatSeconds = [7017, 13849, 15621, 17391, 19045, 20783, 27648, 28902, 29787, 30438, 31073, 32360, 33228, 34531, 35767, 36669, 37304, 37973, 39209, 41364, 42617, 43519, 44170, 44772, 46075, 46960, 48230, 48814, 49499, 50368, 51020, 51688, 52323, 52991, 53826, 55080, 56415, 58504, 59189, 61093, 61528, 61961, 63282, 64084, 65337, 68811, 70097, 70933, 71585, 72236, 73522, 74374, 75678, 76362, 76963, 77799, 78450, 79119, 80405, 81240];
	beatCollection.wititQuarterBeats = [8, 16, 24, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 54, 56, 57, 58, 59, 60, 61, 62, 64, 68, 69, 69, 71, 76, 77, 77, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 91, 92, 93, 94, 96];

Game.prototype = {
	init: function(){
		this.qualityNumbers = [music.bpm * .02, music.bpm * .1,music.bpm * .2,music.bpm * .30,music.bpm * .50];
		this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
		this.currentBeat = 0;
		this.quarterBeatCount = 0;
		this.expectingQuarterBeat = false;
		this.eighthBeatCount = 0;
		this.sixteenthBeatCount = 0;
		this.nextBeat = music.bpm;
		this.nextBeatPrediction = music.bpm;
		this.midBeat = music.bpm / 2;
		this.quarterMidBeat = 0;
		this.indicator = {};
		this.actor = {}
	},
	quarter_note_counter: function(){
		this.quarterBeatCount ++
		this.nextBeat = this.quarterBeatTimer.ms + music.bpm;
		this.check_for_beat()
	},
	eighth_note_counter: function(){
		this.eighthBeatCount ++
		// this.nextBeat = this.quarterBeatTimer.ms + music.bpm;
	},	
	sixteenth_note_counter: function(){
		this.sixteenthBeatCount ++
		// this.nextBeat = this.quarterBeatTimer.ms + music.bpm;
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
		if(this.expectingQuarterBeat){
			if(this.timeQuality == "PERFECT" || this.timeQuality == "GREAT" || this.timeQuality == "GOOD"){actingOn.animations.play('pose',6);
			}else{actingOn.animations.play('fall',5);}
		}else{actingOn.animations.play('fall',5);}
		actingOn.animations.currentAnim.onComplete.add(function(){
			actingOn.animations.play('idle',3);
			actingOn.animations.currentAnim.setFrame(launchFrame,true);
		});
	},
	collect_beats: function(){
		beatCollection.beatCollector.push(this.quarterBeatCount)
		log(beatCollection.beatCollector)
	},
	add_controls: function(){
		controls.space.onDown.add(pause_game);
		controls.step.onDown.add(step_game);
		controls.B.onDown.add(this.collect_beats, this)
		controls.W.onDown.add(this.compare_timing, this)
		controls.mince.onDown.add(this.compare_timing, this)
		controls.dice.onDown.add(this.compare_timing, this)
		controls.slice.onDown.add(this.compare_timing, this)
		controls.mix.onDown.add(this.compare_timing, this)
		controls.flip.onDown.add(this.compare_timing, this)
		
		controls.pose.onDown.add(function(){this.action_one(this.dancer,this.dancer.animations.currentFrame.index)}, this);
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
		this.quarterBeatTimer.loop(music.bpm, this.quarter_note_counter, this)
		this.eighthBeatTimer.loop(music.bpm/2, this.eighth_note_counter, this)
		this.sixteenthBeatTimer.loop(music.bpm/4, this.sixteenth_note_counter, this)		
		this.quarterBeatMidTimer.loop(music.bpm, this.predict_next_beat, this)		
		this.stageTimer.start()
		this.eighthBeatTimer.start()
		this.sixteenthBeatTimer.start()
		game.time.events.add(music.bpm, function(){
			this.quarterBeatCount ++;
			this.quarterBeatTimer.start()
		}, this)
		game.time.events.add(music.bpm / 2, function(){
			this.predict_next_beat()
			this.quarterBeatMidTimer.start()
		}, this);		
		music.track.play()
	},
	check_for_beat: function(){
		// log(this.stageTimer.ms)
		// log(beatCollection.witit[this.currentBeat])
		if(beatCollection.wititQuarterBeats[this.currentBeat]==this.quarterBeatCount){
			this.currentBeat ++;
			this.expectingQuarterBeat = true;
		} else{
			this.expectingQuarterBeat = false;
		}
	},
	preload: function () {
		music.track.stop();
		this.stageTimer = game.time.create(false);
		this.quarterBeatTimer = game.time.create(false);
		this.eighthBeatTimer = game.time.create(false);
		this.sixteenthBeatTimer = game.time.create(false);
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
		game.debug.text('Quarter Beat Count: ' + this.quarterBeatCount, 32, 224);
		game.debug.text("Eighth Beat Count: "+this.eighthBeatCount, 32, 256);
		game.debug.text("Sixteenth Beat Count: "+this.sixteenthBeatCount, 32, 288);
		game.debug.text('My Beat Quality: ' + this.timeQuality, 32, 320);
		game.debug.text('Current Animation Frame: ' + this.dancer.animations.currentFrame.index, 32, 356);
		game.debug.text('Starting Animation From Frame: ' + this.launchFrame, 32, 388);
		game.debug.text('Expecting Quarter Beat : ' + this.expectingQuarterBeat, 32, 420);
	}
};