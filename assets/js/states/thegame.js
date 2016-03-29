Game = function(){};

Game.prototype = {
    init: function(){
        music.bgm.stop();
        this.currentTrack = music.witit;
        this.sixteenthNotes = 0;
        this.eighthNotes = 0;
        this.quarterNotes = 0;
        this.quarterNoteOccurance = 0;
        this.nextQuarterNotePrediction = this.quarterNoteOccurance + this.currentTrack.bpm;
        this.nextQuarterBeat = 1;
        this.quarterSequenceExpectation = 0;
        this.neb/*next expected beat*/ = this.currentTrack.eb[this.quarterSequenceExpectation];
        this.qualityNumbers = [this.currentTrack.bpm * .02, this.currentTrack.bpm * .1,this.currentTrack.bpm * .2,this.currentTrack.bpm * .30,this.currentTrack.bpm * .50];
        this.qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
        this.acceptingInput = false;
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
        controls.W.onDown.add(this.actionOne, this)
        controls.SPACE.onDown.add(pause_game, this);
        controls.F.onDown.add(step_game);
    },
    noteCounter: function(noteType){
        this.sixteenthNotes ++;
        if ( this.sixteenthNotes % 2 == 0){
            this.eighthNotes ++;
        };
        if (this.sixteenthNotes % 4 == 0){
            this.quarterNotes ++;
            this.nextQuarterBeat ++;
            this.io.create();
            this.io.move(this.currentTrack.bpm);
            this.predictNextBeatTime();
            this.expectBeat("quarter");
        };
    },
    predictNextBeatTime: function(){
        this.quarterNoteOccurance = this.stageTimer.ms;
        //this.predictionDifference = this.quarterNoteOccurance - this.nextQuarterNotePrediction;/*just for curiosity*/
        this.nextQuarterNotePrediction = this.quarterNoteOccurance + this.currentTrack.bpm;
    },
    declareHitGoal: function(){
        this.timeToDeclareHitGoal = this.nextQuarterNotePrediction - this.qualityNumbers[4];
        if(this.stageTimer.ms >= this.timeToDeclareHitGoal){
            this.hitGoal = this.nextQuarterNotePrediction;
        }
    },
    expectBeat: function(beatType){
        if(beatType == "quarter") {
            this.neb/*next expected beat*/ = this.currentTrack.eb[this.quarterSequenceExpectation];
            if (this.neb == this.nextQuarterBeat) {
                this.quarterSequenceExpectation ++;
                this.neb = this.currentTrack.eb[this.quarterSequenceExpectation]
                this.startAcceptingInput = this.nextQuarterNotePrediction - this.qualityNumbers[4];
                this.stopAcceptingInput = this.nextQuarterNotePrediction + this.qualityNumbers[4];
                game.time.events.add(this.currentTrack.bpm - this.qualityNumbers[4], function(){
                    this.i1.flash(this.currentTrack.bpm - this.qualityNumbers[4])
                }, this);
            }
        }else{}
    },
    acceptInput: function(){
        if((this.stageTimer.ms >= this.startAcceptingInput) && (this.stageTimer.ms <= this.stopAcceptingInput)){
            this.acceptingInput = true
        }else{this.acceptingInput = false}
    },
    actionOne: function(){
        this.timeQuality = compareTiming(this.stageTimer,this.hitGoal, this.qualityNumbers, this.qualityNames);
        this.acceptInput();
        if( ["PERFECT", "GOOD","GREAT"].indexOf(this.timeQuality) && this.acceptingInput == true){
            log("dance")
        }
    },
    createGraphics: function(){
        gradient_bg(0x0D51a8, 0xe7a36E);
        this.ground = game.add.image(0,500, 'sidewalk');
        this.i1 = new Indicator();
        this.dancer = new Dancer(500,420);
        this.startingLine = new Phaser.Line(600,100,750,100);
        this.q1Line = new Phaser.Line(600,200,750,200);
        this.io = new IndicatorObj();
        this.io.create();
        this.io.move(this.currentTrack.bpm);

    },
    createRhythm: function(){
        music.bgm.play();
        this.stageTimer.start();
        this.expectBeat("quarter");
    },
    preload: function(){
        this.loadControls();
        this.loadTimers();
        this.loadMusic();
    },
    create: function(){
        game.stage.disableVisibilityChange = true;
        this.createGraphics();
        this.createRhythm();
    },
    update: function(){
        this.declareHitGoal();
        //this.actionOne();
    },
    render: function(){
        game.debug.text("Elapsed Seconds: "+this.stageTimer.ms, 32, 32)
        game.debug.text("Sixteenth Notes: "+this.sixteenthNotes, 32, 32*2)
        game.debug.text("Eighth Notes: "+this.eighthNotes, 32, 32*3)
        game.debug.text("Quarter Note Total: "+this.quarterNotes, 32, 32*4)
        game.debug.text("Next Quarter Note Total Is:  "+this.nextQuarterBeat, 32, 32*5)
        game.debug.text("Next expected beat: "+this.neb, 32, 32*6)
        game.debug.text("Quarter Note NOW: "+this.quarterNoteOccurance, 32, 32*7)
        game.debug.text("Next Quarter Note Prediction: "+this.nextQuarterNotePrediction, 32, 32*8)
        //game.debug.text("Prediction was off by... "+this.predictionDifference+" milliseconds", 32, 32*9)
        game.debug.text("Time to accept Input (and declare time to hit): "+this.timeToDeclareHitGoal, 32, 32*10)
        game.debug.text("Goal Hit Time: "+this.hitGoal, 32, 32*11)
        game.debug.text("Accepting Input?.. "+this.acceptingInput, 32, 32*12)
        game.debug.text("Quality of my timing: "+this.timeQuality, 32, 32*13)
        game.debug.geom(this.startingLine)
        game.debug.geom(this.q1Line)
    }
}
