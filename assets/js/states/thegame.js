Game = function(){};

Game.prototype = {
    init: function(){
        music.bgm.stop();
        this.currentTrack = music.witit;
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
        this.im.si.create();
        this.im.si.move(this.currentTrack.bpm *.25);
        if ( this.beatObj16.notes % 2 == 0){
            this.beatObj8.noteCounter(this.stageTimer);
            this.im.ei.create();
            this.im.ei.move(this.currentTrack.bpm *.5);
        }
        if (this.beatObj16.notes % 4 == 0){
            this.beatObj4.noteCounter(this.stageTimer);
            this.im.qi.create();
            this.im.qi.move(this.currentTrack.bpm);
        }
    },
    actionOne: function(beatType){
        if(beatType == "sixteenth"){
            this.sixteenthTimeQuality = compareTiming(this.stageTimer,this.beatObj16.hitGoal, this.beatObj16.qualityNumbers, this.qualityNames);
            this.beatObj16.acceptInput(this.stageTimer);
        }else if(beatType == "eighth"){
            this.eighthTimeQuality = compareTiming(this.stageTimer,this.beatObj8.hitGoal, this.beatObj8.qualityNumbers, this.qualityNames);
            this.beatObj8.acceptInput(this.stageTimer);
        }else{
            this.quarterTimeQuality = compareTiming(this.stageTimer,this.beatObj4.hitGoal, this.beatObj4.qualityNumbers, this.qualityNames);
            this.beatObj4.acceptInput(this.stageTimer);
        }
        //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) && this.acceptingInput == true){
        //    log("dance")
        //}
    },
    createGraphics: function(){
        gradient_bg(0x0D51a8, 0xe7a36E);
        this.ground = game.add.image(0,500, 'sidewalk');
        this.si = new Flasher(0xff0000, 150,300);
        this.ei = new Flasher(0x00ff00, 250,300);
        this.qi = new Flasher(0x0000ff, 350, 300);
        this.dancer = new Dancer(500,420);

        this.im = new IndicatorManager(600,300);

    },
    startRhythm: function(){
        this.beatObj16 = new BeatObj(this.currentTrack.bpm, this.si,.25, this.currentTrack.esb)
        this.beatObj8 = new BeatObj(this.currentTrack.bpm, this.ei,.5, this.currentTrack.eeb)
        this.beatObj4 = new BeatObj(this.currentTrack.bpm, this.qi,1, this.currentTrack.eqb)

        music.bgm.play();
        this.stageTimer.start();

        this.im.qi.create();
        this.im.ei.create();
        this.im.si.create();
        this.im.qi.move(this.currentTrack.bpm);
        this.im.ei.move(this.currentTrack.bpm *.5);
        this.im.si.move(this.currentTrack.bpm *.25);


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
        this.createGraphics();
        this.startRhythm();
    },
    update: function(){
        this.beatObj16.declareHitGoal(this.stageTimer);
        this.beatObj8.declareHitGoal(this.stageTimer);
        this.beatObj4.declareHitGoal(this.stageTimer);

        //this.actionOne("sixteenth");
        //this.actionOne("eighth");
        //this.actionOne("quarter");
    },
    render: function(){
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