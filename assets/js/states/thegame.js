Game = function(){};

Game.prototype = {
    // ONE IMPORTANT NOTE ABOUT THE WAY THIS CODE WORKS: INIT, PRELOAD, CREATE, UPDATE, and RENDER are 4 natural Phaser States. They will be executing IN ORDER as the game loads AND Update and Render repeat (as fast as possible(like FPS or whatever)).
    init: function(){
        music.bgm.stop();
        this.trackInfo = tracks.btstu;
        music.bgm = game.add.audio(this.trackInfo.name);
    },
    loadAudio: function(){
        sndfx.clang1 = game.add.audio('clang1');
        sndfx.clang1.volume = 0.3;
        music.bgm.volume =0.35;
    },
    loadControls: function(){
        controls.A.onDown.add(function(){actionOne("thirtysecond",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.W.onDown.add(function(){actionOne("thirtysecond",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.UP.onDown.add(function(){actionOne("sixteenth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.D.onDown.add(function(){actionOne("eighth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.LEFT.onDown.add(function(){actionOne("quarter",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.S.onDown.add(function(){actionOne("thirysecond ",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.E.onDown.add(function(){actionOne("sixteenth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.F.onDown.add(function(){actionOne("eighth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.RIGHT.onDown.add(function(){actionOne("sixteenth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);}, this);
        controls.SPACE.onDown.add(pause_game, this);
        controls.G.onDown.add(step_game);
        controls.P.onUp.add(gofull)
    },
    loadGraphics: function(){
    },
    createElements: function(){
        this.stage = new LevelStage(game.stage);
        this.stage.constructWindows();
        this.sky1 = gradient_bg(0x0D51a8, 0xe7a36E);
        this.grillBg = new CroppedSprite(0,this.stage.windowA.position.x,this.sky1,[1,.85],this.stage)
        this.grill = new CroppedSprite(-100,0,"grill",[4.05,4.05],this.stage)

        this.im = new IndicatorManager(/*600,300*/);
        this.im.constructSliders(420, 0);
        this.im.constructFlashers(430,80, 9);
        //this.im.constructExpectingFlashers(150,300);

        this.hm = new HungryManager();
        this.hm.addHungry();

        this.chef = new Chef(this.stage);

        this.measureGraphics = new MeasurementManager(this.trackInfo, this.stage);
    },
    startRhythm: function(){
        this.bm = new BeatManager(this.trackInfo, this.im);

        this.stageTimer = game.time.create(false);
        //this.stageTimer.loop(this.trackInfo.bpm/4, function(){noteCounter(this.bm, this.stageTimer, this.im, this.trackInfo.bpm, this.hm)}, this)

        this.musicBeatObj = new MusicBeatObj(this.trackInfo, this.measureGraphics, this.bm, this.im, this.hm)

        music.bgm.onStop.add(function(){game.state.start('splash')});
        music.bgm.play();
        this.stageTimer.start();

        //this.im.qs.indicate(this.trackInfo.bpm);
        //this.im.es.indicate(this.trackInfo.bpm *.5);
        //this.im.ss.indicate(this.trackInfo.bpm *.25);

        //this.bm.beatObj16.expectBeat();
        //this.bm.beatObj8.expectBeat();
        //this.bm.beatObj4.expectBeat();

    },
    preload: function(){
        this.loadControls();
        this.loadAudio();
        //this.loadGraphics();
    },
    create: function(){
        game.stage.disableVisibilityChange = true;
        this.createElements();
        this.startRhythm();
    },
    update: function(){
        this.musicBeatObj.update(music.bgm.currentTime);

        for(hungry in this.hm.hungerCount){
            this.hm.hungerCount[hungry].update()
        }

        //Uncomment these for debugging beat input
        actionOne("thirtysecond",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);
        actionOne("sixteenth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);
        actionOne("eighth",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);
        actionOne("quarter",this.hm, music.bgm.currentTime, this.chef, this.musicBeatObj);
    },
    render: function(){
        game.debug.text("Quality of my ThirtySecond Timing: "+this.musicBeatObj.timingQuality32, 32, 12)
        game.debug.text("Quality of my Sixteenth Timing: "+this.musicBeatObj.timingQuality16, 32, 32)
        game.debug.text("Quality of my Eighth Timing: "+this.musicBeatObj.timingQuality8, 32, 32*1.5)
        game.debug.text("Quality of my Quarter Timing: "+this.musicBeatObj.timingQuality4, 32, 32*2)

        game.debug.text("Music Time: "+music.bgm.currentTime, 32, 32*3)
        game.debug.text("Music Duration : " + this.musicBeatObj.duration, 32, 32 * 3.5)
        game.debug.text("Current 32: " + this.musicBeatObj.current32, 32, 32 * 4)
        game.debug.text("Time of 32: "+this.musicBeatObj.timeOf32, 32, 32*4.5)
        game.debug.text("Next Thirty Second: " + this.musicBeatObj.next32, 32, 32 * 5)
        game.debug.text("Declare Hit Goal 32 at: " + this.musicBeatObj.declareHitGoal32, 32, 32 * 5.5)
        game.debug.text(" Hit Goal 32 : " + this.musicBeatObj.hitGoal32, 500, 32* 5.5)
        game.debug.text("Current 16: " + this.musicBeatObj.current16, 32, 32 * 6)
        game.debug.text("Time of 16: "+this.musicBeatObj.timeOf16, 32, 32*6.5)
        game.debug.text("Next Sixteenth: " + this.musicBeatObj.next16, 32, 32 * 7)
        game.debug.text("Declare Hit Goal 16 at: " + this.musicBeatObj.declareHitGoal16, 32, 32 * 7.5)
        game.debug.text("Hit Goal 16 : " + this.musicBeatObj.hitGoal16, 500, 32 * 7.5)
        game.debug.text("Current 8: " + this.musicBeatObj.current8, 32, 32 * 8)
        game.debug.text("Time of 8: "+this.musicBeatObj.timeOf8, 32, 32*8.5)
        game.debug.text("Next Eighth: " + this.musicBeatObj.next8, 32, 32 * 9)
        game.debug.text("Declare Hit Goal 8 at : " + this.musicBeatObj.declareHitGoal8, 32, 32 * 9.5)
        game.debug.text("Hit Goal 8 : " + this.musicBeatObj.hitGoal8, 500, 32 * 9.5)
        game.debug.text("Current 4: " + this.musicBeatObj.current4, 32, 32 * 10)
        game.debug.text("Time of 4: "+this.musicBeatObj.timeOf4, 32, 32*10.5)
        game.debug.text("Next 4: " + this.musicBeatObj.next4, 32, 32 * 11)
        game.debug.text("Decare Hit Goal 4 at : " + this.musicBeatObj.declareHitGoal4, 32, 32 * 11.5)
        game.debug.text("Hit Goal 4 : " + this.musicBeatObj.hitGoal4, 500, 32 * 11.5)
        game.debug.text("Measure Count: " + this.musicBeatObj.measureCount, 32, 32 * 12)
        game.debug.text("Total Measures: " + this.musicBeatObj.totalMeasures, 32, 32 * 12.5)

        game.debug.geom(this.im.startingLine)
        game.debug.geom(this.im.qLine)
        game.debug.geom(this.im.sLine)
        game.debug.geom(this.im.tLine)
        game.debug.geom(this.im.eLine)
        /*
        game.debug.text("Upcoming Beat: "+this.musicBeatObj.upcomingBeat, 32, 32*1.5)
        game.debug.text("Current Track BPM: "+this.trackInfo.bpm, 32, 32*2)
        game.debug.text("Current track time divisible by BPM: "+this.musicBeatObj.timeOfBPM, 32, 32*3)
        */

        // BEAT INFO

        //game.debug.text("Thirtysecond Notes: "+this.bm.beatObj32.notes, 32, 32 *13.5);
        //game.debug.text("Next Thirtysecond Is:  "+this.bm.beatObj32.nextBeat, 32, 32*14);
        //game.debug.text("Next expected Thirtysecond beat: "+this.bm.beatObj32.neb, 32, 32*14.5);
        //game.debug.text("Thirtysecond Note NOW: "+this.bm.beatObj32.noteOccurance, 32, 32*15);
        //game.debug.text("Next Thirtysecond Prediction: "+this.bm.beatObj32.nextNotePrediction, 32, 32*15.5);
        //
        //game.debug.text("Sixteenth Notes: "+this.bm.beatObj16.notes, 32, 32 *10.5);
        //game.debug.text("Next Sixteenth Is:  "+this.bm.beatObj16.nextBeat, 32, 32*11);
        //game.debug.text("Next expected Sixteenth beat: "+this.bm.beatObj16.neb, 32, 32*11.5);
        //game.debug.text("Sixteenth Note NOW: "+this.bm.beatObj16.noteOccurance, 32, 32*12);
        //game.debug.text("Next Sixteenth Prediction: "+this.bm.beatObj16.nextNotePrediction, 32, 32*12.5);
        //
        //game.debug.text("Eighth Notes: "+ this.bm.beatObj8.notes, 32, 32*8);
        //game.debug.text("Next Eighth Is:  "+this.bm.beatObj8.nextBeat, 32, 32*8.5);
        //game.debug.text("Next expected Eighth beat: "+this.bm.beatObj8.neb, 32, 32*9);
        //game.debug.text("Eighth Note NOW: "+this.bm.beatObj8.noteOccurance, 32, 32*9.5);
        //game.debug.text("Next Eighth Prediction: "+this.bm.beatObj8.nextNotePrediction, 32, 32*10);

        //game.debug.text("Quarter Notes: "+this.bm.beatObj4.notes, 32, 32*7.5)
        //game.debug.text("Next Quarter Note Is:  "+this.bm.beatObj4.nextBeat, 32, 32*8)
        //game.debug.text("Next expected Quarter beat: "+this.bm.beatObj4.neb, 32, 32*8.5)
        //game.debug.text("Quarter Note NOW: "+this.bm.beatObj4.noteOccurance, 32, 32*9)
        //game.debug.text("Next Quarter Prediction: "+this.bm.beatObj4.nextNotePrediction, 32, 32*9.5)


        /* FIRST VERSION (just quarter notes working)
        //game.debug.text("Prediction was off by... "+this.predictionDifference+" milliseconds", 32, 32*9)
        game.debug.text("Time to accept Input (and declare time to hit): "+this.timeToDeclareHitGoal, 32, 32*10)
        game.debug.text("Goal Hit Time: "+this.hitGoal, 32, 32*11)
        game.debug.text("Accepting Input?.. "+this.acceptingInput, 32, 32*12)
        */
    }
}