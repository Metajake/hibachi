Game = function(){};

Game.prototype = {
    // ONE IMPORTANT NOTE ABOUT THE WAY THIS CODE WORKS: INIT, PRELOAD, CREATE, UPDATE, and RENDER are 4 natural Phaser States. They will be executing IN ORDER as the game loads AND Update and Render repeat (as fast as possible(like FPS or whatever)).
    init: function(){
        music.bgm.stop();
        this.trackInfo = tracks.witit;
    },
    loadAudio: function(){
        music.bgm = game.add.audio(this.trackInfo.name);
        music.bgm.volume = this.trackInfo.volume;
        music.bgm.onStop.add(function(){game.playing = false;});


        this.sm = new SoundManager();

        this.sm.shkingSS1 = this.sm.addSound('shking_soft_short1',1,this.sm.utinsels);
        this.sm.sharpenL1 = this.sm.addSound('sharpen_long1',1,this.sm.utinsels);
        this.sm.sharpenL2 = this.sm.addSound('sharpen_long2',1,this.sm.utinsels);
        this.sm.sharpenL3 = this.sm.addSound('sharpen_long3',1,this.sm.utinsels);
        this.sm.sharpenS1 = this.sm.addSound('sharpen_short1',1,this.sm.utinsels);
        this.sm.sharpenS2 = this.sm.addSound('sharpen_short2',1,this.sm.utinsels);
    },
    loadControls: function(){
        controls.W.onDown.add(function(){actionOne(this.musicObj.beat32, this.hm, /* music.bgm.currentTime */ this.musicObj.theTime, this.chef, this.sm);}, this);
        controls.UP.onDown.add(function(){actionOne(this.musicObj.beat16, this.hm, /* music.bgm.currentTime */ this.musicObj.theTime, this.chef, this.sm);}, this);
        controls.D.onDown.add(function(){actionOne(this.musicObj.beat8, this.hm, /* music.bgm.currentTime */ this.musicObj.theTime, this.chef, this.sm);}, this);
        controls.LEFT.onDown.add(function(){actionOne(this.musicObj.beat4, this.hm, /* music.bgm.currentTime */ this.musicObj.theTime, this.chef, this.sm);}, this);
        controls.SPACE.onDown.add(pause_game, this);
        controls.G.onDown.add(step_game);
        controls.P.onUp.add(gofull)
    },
    loadGraphics: function(){
    },
    createElements: function(){
        this.stage = new LevelStage(game.stage);
        this.stage.constructWindows();
        this.stage.constructElements();

        this.im = new IndicatorManager(/*600,300*/);
        this.im.constructIndicators(35,130);
        //this.measureGraphics = new MeasurementManagerHorizontal(this.trackInfo, this.stage);
        //this.measureGraphics = new MeasurementManagerVertical(this.trackInfo, this.stage, 35,-20);//####### 150 HIGHER then SLIDE INDICATORS

        this.hm = new HungryManager(this.stage);
        //this.hm.addHungry();

        this.chef = new Chef(this.stage);
    },
    startRhythm: function(){
        this.stageTimer = game.time.create(false);

        this.musicObj = new MusicObj(this.trackInfo, this.stage, this.measureGraphics, this.im, this.hm,  music.bgm.currentTime)

        music.bgm.play();
        this.stageTimer.start();

        // ON MUSIC.BGM PLAY EXECUTE SOME STUFF (indicators)
        //music.bgm.onPlay.add(function(){
        //    //this.musicObj.setupMeasure(this.trackInfo.bpm*8);
        //    this.im.ts.indicate(this.trackInfo.bpm *.125);
        //    this.im.ss.indicate(this.trackInfo.bpm *.25);
        //    this.im.es.indicate(this.trackInfo.bpm *.5);
        //    this.im.qs.indicate(this.trackInfo.bpm);
        //},this);

        // FOR WHEN WE DO EXPECTED BEATS again
        //this.bm.beatObj16.expectBeat();
        //this.bm.beatObj8.expectBeat();
        //this.bm.beatObj4.expectBeat();

    },
    preload: function(){
        this.loadControls();
        this.loadAudio();
        this.loadGraphics();
    },
    create: function(){
        game.stage.disableVisibilityChange = true;
        game.playing = true;

        this.createElements();
        this.startRhythm();
    },
    update: function(){
        this.musicObj.update(music.bgm.currentTime);

        for(hungry in this.hm.hungerCount){
            this.hm.hungerCount[hungry].update()
        }

        if(game.playing == false){
            game.state.start('splash');
        };

        //Uncomment these for debugging beat input
        //actionOne(this.musicObj.beat32, this.hm, music.bgm.currentTime, this.chef)
        //actionOne(this.musicObj.beat16, this.hm, music.bgm.currentTime, this.chef)
        //actionOne(this.musicObj.beat8, this.hm, music.bgm.currentTime, this.chef)
        //actionOne(this.musicObj.beat4, this.hm, music.bgm.currentTime, this.chef)
    },
    render: function(){
        game.debug.text(/*"Quality of my ThirtySecond Timing: "+*/this.musicObj.beat32.qualityResult, 80, 32*14)
        game.debug.text(/*"Quality of my Sixteenth Timing: "+*/this.musicObj.beat16.qualityResult,700, 32*14)
        game.debug.text(/*"Quality of my Eighth Timing: "+*/this.musicObj.beat8.qualityResult, 130, 32*15)
        game.debug.text(/*"Quality of my Quarter Timing: "+*/this.musicObj.beat4.qualityResult, 640, 32*15)

        game.debug.text("Music Time: "+music.bgm.currentTime, 32, 32*3)
        game.debug.text("Music Time: "+this.musicObj.theTime, 32, 32*3.5)
        //game.debug.text("Music Duration : " + this.musicObj.duration, 32, 32 * 3.5)
        //game.debug.text("Current 32: " + this.musicObj.current32, 32, 32 * 4)
        //game.debug.text("Time of 32: "+this.musicObj.timeOf32, 32, 32*4.5)
        //game.debug.text("Next Thirty Second: " + this.musicObj.next32, 32, 32 * 5)
        //game.debug.text("Declare Hit Goal 32 at: " + this.musicObj.declareHitGoal32, 32, 32 * 5.5)
        //game.debug.text(" Hit Goal 32 : " + this.musicObj.hitGoal32, 500, 32* 5.5)
        //game.debug.text("Current 16: " + this.musicObj.current16, 32, 32 * 6)
        //game.debug.text("Time of 16: "+this.musicObj.timeOf16, 32, 32*6.5)
        //game.debug.text("Next Sixteenth: " + this.musicObj.next16, 32, 32 * 7)
        //game.debug.text("Declare Hit Goal 16 at: " + this.musicObj.declareHitGoal16, 32, 32 * 7.5)
        //game.debug.text("Hit Goal 16 : " + this.musicObj.hitGoal16, 500, 32 * 7.5)
        //game.debug.text("Current 8: " + this.musicObj.current8, 32, 32 * 8)
        //game.debug.text("Time of 8: "+this.musicObj.timeOf8, 32, 32*8.5)
        //game.debug.text("Next Eighth: " + this.musicObj.next8, 32, 32 * 9)
        //game.debug.text("Declare Hit Goal 8 at : " + this.musicObj.declareHitGoal8, 32, 32 * 9.5)
        //game.debug.text("Hit Goal 8 : " + this.musicObj.hitGoal8, 500, 32 * 9.5)
        //game.debug.text("Current 4: " + this.musicObj.current4, 32, 32 * 10)
        //game.debug.text("Time of 4: "+this.musicObj.timeOf4, 32, 32*10.5)
        //game.debug.text("Next 4: " + this.musicObj.next4, 32, 32 * 11)
        //game.debug.text("Decare Hit Goal 4 at : " + this.musicObj.declareHitGoal4, 32, 32 * 11.5)
        //game.debug.text("Hit Goal 4 : " + this.musicObj.hitGoal4, 500, 32 * 11.5)
        //game.debug.text("Measure Count: " + this.musicObj.measureCount, 32, 32 * 12)
        //game.debug.text("Total Measures: " + this.musicObj.totalMeasures, 32, 32 * 12.5)

        game.debug.geom(this.im.leftStart)
        game.debug.geom(this.im.rightStart)
        game.debug.geom(this.im.qLine)
        game.debug.geom(this.im.sLine)
        game.debug.geom(this.im.tLine)
        game.debug.geom(this.im.t2Line)
        game.debug.geom(this.im.eLine)
        /*
        game.debug.text("Upcoming Beat: "+this.musicObj.upcomingBeat, 32, 32*1.5)
        game.debug.text("Current Track BPM: "+this.trackInfo.bpm, 32, 32*2)
        game.debug.text("Current track time divisible by BPM: "+this.musicObj.timeOfBPM, 32, 32*3)
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