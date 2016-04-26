Game = function(){};

Game.prototype = {
    init: function(){
        music.bgm.stop();
        this.currentTrack = music.carlos;
        this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
    },
    loadMusic: function(){
        music.bgm = game.add.audio(this.currentTrack.name);
        music.bgm.volume =0.35;
    },
    loadTimers: function(){
        this.stageTimer = game.time.create(false);
        this.stageTimer.loop(this.currentTrack.bpm/4, this.noteCounter, this)
    },
    loadControls: function(){
        controls.A.onDown.add(function(){this.actionOne("sixteenth");}, this);
        controls.W.onDown.add(function(){this.actionOne("eighth");}, this);
        controls.D.onDown.add(function(){this.actionOne("quarter");}, this);
        controls.SPACE.onDown.add(pause_game, this);
        controls.F.onDown.add(step_game);
    },
    noteCounter: function(){
        this.beatObj16.noteCounter(this.stageTimer, this.beatObj16.notes);
        this.im.ss.indicate(this.currentTrack.bpm *.25);
        this.im.sf.flash(this.currentTrack.bpm *.02);
        if ( this.beatObj16.notes % 2 == 0){
            this.beatObj8.noteCounter(this.stageTimer);
            this.im.es.indicate(this.currentTrack.bpm *.5);
            this.im.ef.flash(this.currentTrack.bpm *.02);
        }
        if (this.beatObj16.notes % 4 == 0){
            this.beatObj4.noteCounter(this.stageTimer);
            this.im.qs.indicate(this.currentTrack.bpm);
            this.im.qf.flash(this.currentTrack.bpm *.02);
            this.hm.checkForHungry()
        }
    },
    actionOne: function(beatType){
        hungerCountPos = this.hm.checkHungriest();
        if(beatType == "sixteenth"){
            this.sixteenthTimeQuality = compareTiming(this.stageTimer,this.beatObj16.hitGoal, this.beatObj16.qualityNumbers, this.qualityNames);
            //this.beatObj16.acceptInput(this.stageTimer)
            //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
            //    log("dance")
            //}
            if(["PERFECT","GREAT", "GOOD"].indexOf(this.sixteenthTimeQuality) !== -1){
                this.hm.hungerCount[hungerCountPos].feed(this.hm.hungerCount,hungerCountPos, 30, this.sixteenthTimeQuality)
            }
        }else if(beatType == "eighth"){
            this.eighthTimeQuality = compareTiming(this.stageTimer,this.beatObj8.hitGoal, this.beatObj8.qualityNumbers, this.qualityNames);
            if(["PERFECT","GREAT", "GOOD"].indexOf(this.eighthTimeQuality) !== -1){
                this.hm.hungerCount[hungerCountPos].feed(this.hm.hungerCount,hungerCountPos, 50, this.eighthTimeQuality)
            }
        }else {
            this.quarterTimeQuality = compareTiming(this.stageTimer, this.beatObj4.hitGoal, this.beatObj4.qualityNumbers, this.qualityNames);
            if (["PERFECT", "GREAT", "GOOD"].indexOf(this.quarterTimeQuality) !== -1) {
                this.hm.hungerCount[hungerCountPos].feed(this.hm.hungerCount, hungerCountPos, 80, this.quarterTimeQuality)
            }
        }
    },
    createElements: function(){
        gradient_bg(0x0D51a8, 0xe7a36E);
        this.ground = game.add.image(0,500, 'sidewalk');
        this.si = new Flasher(150,300, 'chickenleg', 0x0000ff);
        this.ei = new Flasher(250,300, 'chickenleg', 0xff0000);
        this.qi = new Flasher(350, 300, 'chickenleg', 0x00ff00);
        this.dancer = new Dancer(500,420);
        this.cube = new Cube(100,80);

        this.im = new IndicatorManager(600,300);
        this.im.constructSliders();
        this.im.constructFlashers(0,300);

        this.hm = new HungryManager();
    },
    startRhythm: function(){
        this.beatObj16 = new regBeatObj(this.currentTrack.bpm, this.si,.25, this.currentTrack.esb)
        this.beatObj8 = new regBeatObj(this.currentTrack.bpm, this.ei,.5, this.currentTrack.eeb);
        this.beatObj4 = new regBeatObj(this.currentTrack.bpm, this.qi,1, this.currentTrack.eqb);

        this.musicBeatObj = new musicBeatObj(this.currentTrack, this.im.mbf)

        music.bgm.play();
        music.bgm.onStop.add(function(){game.state.start('splash')})
        this.stageTimer.start();

        this.im.qs.indicate(this.currentTrack.bpm);
        this.im.es.indicate(this.currentTrack.bpm *.5);
        this.im.ss.indicate(this.currentTrack.bpm *.25);

        this.beatObj16.expectBeat();
        this.beatObj8.expectBeat();
        this.beatObj4.expectBeat();

    },
    preload: function(){
        this.loadControls();
        this.loadTimers();
        this.loadMusic();
    },
    create: function(){
        game.stage.disableVisibilityChange = true;
        this.createElements();
        this.startRhythm();
    },
    update: function(){
        this.beatObj16.declareHitGoal(this.stageTimer);
        this.beatObj8.declareHitGoal(this.stageTimer);
        this.beatObj4.declareHitGoal(this.stageTimer);

        this.musicBeatObj.update(music.bgm.currentTime);

        for(hungry in this.hm.hungerCount){
            this.hm.hungerCount[hungry].update()
        }

        //Uncomment these for debugging beat input
        //this.actionOne("sixteenth");
        //this.actionOne("eighth");
        //this.actionOne("quarter");
    },
    render: function(){
        game.debug.text("Music Time: "+music.bgm.currentTime, 32, 32)
        game.debug.text("Upcoming Beat: "+this.musicBeatObj.upcomingBeat, 32, 32*1.5)
        game.debug.text("Current Track BPM: "+this.currentTrack.bpm, 32, 32*2)
        game.debug.text("Next BPM: "+this.musicBeatObj.nextBpm, 32, 32*2.5)
        game.debug.text("Current track time divisible by BPM: "+this.musicBeatObj.timeOfBPM, 32, 32*3)
        // BEAT INFO
        /*
        game.debug.text("Elapsed Seconds: "+this.stageTimer.ms, 32, 32);
        game.debug.text("Sixteenth Notes: "+this.beatObj16.notes, 32, 32 *1.5);
        game.debug.text("Next Sixteenth Is:  "+this.beatObj16.nextBeat, 32, 32*2);
        game.debug.text("Next expected Sixteenth beat: "+this.beatObj16.neb, 32, 32*2.5);
        game.debug.text("Sixteenth Note NOW: "+this.beatObj16.noteOccurance, 32, 32*3);
        game.debug.text("Next Sixteenth Prediction: "+this.beatObj16.nextNotePrediction, 32, 32*3.5);
        game.debug.text("Eighth Notes: "+ this.beatObj8.notes, 32, 32*4.5);
        game.debug.text("Next Eighth Is:  "+this.beatObj8.nextBeat, 32, 32*5);
        game.debug.text("Next expected Eighth beat: "+this.beatObj8.neb, 32, 32*5.5);
        game.debug.text("Eighth Note NOW: "+this.beatObj8.noteOccurance, 32, 32*6);
        game.debug.text("Next Eighth Prediction: "+this.beatObj8.nextNotePrediction, 32, 32*6.5);
        game.debug.text("Quarter Notes: "+this.beatObj4.notes, 32, 32*7.5)
        game.debug.text("Next Quarter Note Is:  "+this.beatObj4.nextBeat, 32, 32*8)
        game.debug.text("Next expected Quarter beat: "+this.beatObj4.neb, 32, 32*8.5)
        game.debug.text("Quarter Note NOW: "+this.beatObj4.noteOccurance, 32, 32*9)
        game.debug.text("Next Quarter Prediction: "+this.beatObj4.nextNotePrediction, 32, 32*9.5)
        */
        game.debug.text("Quality of my Sixteenth Timing: "+this.sixteenthTimeQuality, 32, 32*10.5)
        game.debug.text("Quality of my Eighth Timing: "+this.eighthTimeQuality, 32, 32*11)
        game.debug.text("Quality of my Quarter Timing: "+this.quarterTimeQuality, 32, 32*11.5)

        /* FIRST VERSION (just quarter notes working)
        //game.debug.text("Prediction was off by... "+this.predictionDifference+" milliseconds", 32, 32*9)
        game.debug.text("Time to accept Input (and declare time to hit): "+this.timeToDeclareHitGoal, 32, 32*10)
        game.debug.text("Goal Hit Time: "+this.hitGoal, 32, 32*11)
        game.debug.text("Accepting Input?.. "+this.acceptingInput, 32, 32*12)
        */
        game.debug.geom(this.im.startingLine)
        game.debug.geom(this.im.qLine)
        game.debug.geom(this.im.sLine)
        game.debug.geom(this.im.eLine)
    }
}