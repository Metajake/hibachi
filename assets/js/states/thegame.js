Game = function(){};

Game.prototype = {
    // ONE IMPORTANT NOTE ABOUT THE WAY THIS CODE WORKS: INIT, PRELOAD, CREATE, UPDATE, and RENDER are 4 natural Phaser States. They will be executing IN ORDER as the game loads AND Update and Render repeat (as fast as possible(like FPS or whatever)).
    init: function(){
        music.bgm.stop();
        this.trackInfo = tracks.enter;
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
        controls.W.onDown.add(function(){actionOne(this.musicObj.beat32, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.UP.onDown.add(function(){actionOne(this.musicObj.beat16, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.D.onDown.add(function(){actionOne(this.musicObj.beat8, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.LEFT.onDown.add(function(){actionOne(this.musicObj.beat4, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
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

        this.im = new IndicatorManager(this.stage);
        this.im.constructIndicators();
        //this.measureGraphics = new MeasurementManagerHorizontal(this.trackInfo, this.stage);
        //this.measureGraphics = new MeasurementManagerVertical(this.trackInfo, this.stage, 35,-20);//####### 150 HIGHER then SLIDE INDICATORS

        this.chef = new Chef(this.stage);

        this.hm = new HungryManager(this.stage, this.chef);
        //this.hm.addHungry();

        this.tm = new TextManager(this.stage);
    },
    startRhythm: function(){
        this.stageTimer = game.time.create(false);

        this.musicObj = new MusicObj(this.trackInfo, this.stage, this.im, this.hm,  music.bgm.currentTime)

        music.bgm.play();
        this.stageTimer.start();

        // ON MUSIC.BGM PLAY EXECUTE SOME STUFF (indicators)
        music.bgm.onPlay.add(function(){
        //    //this.musicObj.setupMeasure(this.trackInfo.bpm*8);
            this.im.ts.indicate(this.musicObj.beat32.duration);
            this.im.ss.indicate(this.musicObj.beat16.duration);
            this.im.es.indicate(this.musicObj.beat8.duration);
            this.im.qs.indicate(this.musicObj.beat4.duration);
        },this);

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

        if(game.playing == false){
            game.state.start('splash');
        };

        //Uncomment these for debugging beat input
        //actionOne(this.musicObj.beat32, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyW")
        //actionOne(this.musicObj.beat16, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowUp")
        //actionOne(this.musicObj.beat8, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyD")
        //actionOne(this.musicObj.beat4, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowLeft")
    },
    render: function(){
        game.debug.geom(this.stage.p1)
        game.debug.geom(this.stage.p2)
        game.debug.geom(this.stage.p3)

        game.debug.geom(this.im.leftStart)

        //this.testLine = new Phaser.Line(this.stage.p1.x,this.stage.p1.y,this.stage.p1.x+100,this.stage.p1.y+100);
        //game.debug.geom(this.testLine)

        //game.debug.text(/*"Quality of my ThirtySecond Timing: "+*/this.musicObj.beat32.qualityResult, this.stage.p1.x, 32*14)

        game.debug.text("Grill Rep: "+this.chef.grill.rep, 32, 32)
        //i=2;
        //for(hungry in this.hm.hungerCount){
        //    game.debug.text("dude "+ hungry+ ", Fed count: "+ this.hm.hungerCount[hungry].fedCount+ ", impatience level: "+ this.hm.hungerCount[hungry].impatience+ ", tolerance level: "+ this.hm.hungerCount[hungry].tolerance, 32, 32*i);
        //    i++;
        //}

        //game.debug.text("Music Time: "+music.bgm.currentTime, 32, 32*3)
        //game.debug.text("THE Time: "+this.musicObj.theTime, 32, 32*3.5)
        //game.debug.text("Music Duration : " + this.musicObj.duration, 32, 32 * 4)
        //game.debug.text("Measure Count: " + this.musicObj.measureCount, 32, 32 * 4.5)
        //game.debug.text("Total Measures: " + this.musicObj.totalMeasures, 32, 32 * 5)
        //game.debug.text("Current Track BPM: "+this.trackInfo.bpm, 32, 32*2)
        //game.debug.text("Current track time divisible by BPM: "+this.musicObj.timeOfBPM, 32, 32*3)

        // BEAT INFO

        //game.debug.text("32 Notes: "+this.musicObj.beat32.currentBeat, 32, 32 *4.5);
        //game.debug.text("32 Beat Duration:  "+this.musicObj.beat32.duration, 32, 32*5);
        //game.debug.text("32 Next Beat:  "+this.musicObj.beat32.nextBeat, 32, 32*5.5);
        //game.debug.text("32 HitGoal: "+this.musicObj.beat32.hitGoal, 32, 32*6);
        //game.debug.text("32 Declare HitGoal: "+this.musicObj.beat32.declareHitGoal, 32, 32*6.5);
        //game.debug.text("32 Time Of Beat: "+this.musicObj.beat32.timeOfBeat, 32, 32*7);
        //game.debug.text("32 Difference of Hit Goal and TimeOfBeat: "+ (this.musicObj.beat32.hitGoal-this.musicObj.beat32.timeOfBeat), 32, 32*7.5);

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