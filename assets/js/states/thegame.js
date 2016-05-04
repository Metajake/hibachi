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
    loadControls: function(){
        controls.A.onDown.add(function(){actionOne("sixteenth",this.hm, this.stageTimer, this.bm, this.fm, this.stage);}, this);
        controls.W.onDown.add(function(){actionOne("eighth",this.hm, this.stageTimer, this.bm, this.fm, this.stage);}, this);
        controls.D.onDown.add(function(){actionOne("quarter",this.hm, this.stageTimer, this.bm, this.fm, this.stage);}, this);
        controls.SPACE.onDown.add(pause_game, this);
        controls.F.onDown.add(step_game);
        controls.P.onUp.add(gofull)
    },
    loadGraphics: function(){
        game.load.spritesheet('noodles', 'assets/img/noodles1.png', 50,50);
    },
    createElements: function(){
        this.stage = new Stage(game.stage);
        this.stage.constructWindows(5);

        //this.ground = game.add.image(0,500, 'sidewalk');
        //this.dancer = new Dancer(100,80);

        this.im = new IndicatorManager(600,300);
        this.im.constructSliders();
        this.im.constructFlashers(0,300);
        this.im.constructExpectingFlashers(150,300);

        this.hm = new HungryManager();
        this.hm.addHungry();

        this.fm = new FoodManager(this.stage);
        //this.fm.ndls = this.fm.addFood("noodles",2,["shortcake"]);
        //this.fm.shrtck = this.fm.addFood("shortcake",10,[]);
        //this.fm.ndls.combine(this.fm.shrtck)
    },
    startRhythm: function(){
        this.bm = new BeatManager();
        this.bm.constructBeats(this.currentTrack.bpm, this.im.sef,this.im.eef, this.im.qef,this.currentTrack.esb,this.currentTrack.eeb,this.currentTrack.eqb);

        this.stageTimer = game.time.create(false);
        this.stageTimer.loop(this.currentTrack.bpm/4, function(){noteCounter(this.bm, this.stageTimer, this.im, this.currentTrack.bpm, this.hm)}, this)

        this.musicBeatObj = new musicBeatObj(this.currentTrack, this.im.mbf)

        music.bgm.play();
        music.bgm.onStop.add(function(){game.state.start('splash')})
        this.stageTimer.start();

        this.im.qs.indicate(this.currentTrack.bpm);
        this.im.es.indicate(this.currentTrack.bpm *.5);
        this.im.ss.indicate(this.currentTrack.bpm *.25);

        this.bm.beatObj16.expectBeat();
        this.bm.beatObj8.expectBeat();
        this.bm.beatObj4.expectBeat();

    },
    preload: function(){
        this.loadControls();
        this.loadMusic();
        this.loadGraphics();
    },
    create: function(){
        game.stage.disableVisibilityChange = true;
        this.createElements();
        this.startRhythm();
    },
    update: function(){
        this.bm.beatObj16.declareHitGoal(this.stageTimer);
        this.bm.beatObj8.declareHitGoal(this.stageTimer);
        this.bm.beatObj4.declareHitGoal(this.stageTimer);

        //NEW
        this.musicBeatObj.update(music.bgm.currentTime);

        for(hungry in this.hm.hungerCount){
            this.hm.hungerCount[hungry].update()
        }

        //Uncomment these for debugging beat input
        //actionOne("sixteenth");
        //actionOne("eighth");
        //actionOne("quarter");
    },
    render: function(){
        // NEW MUSIC OBJ
        /*
        game.debug.text("Music Time: "+music.bgm.currentTime, 32, 32)
        game.debug.text("Upcoming Beat: "+this.musicBeatObj.upcomingBeat, 32, 32*1.5)
        game.debug.text("Current Track BPM: "+this.currentTrack.bpm, 32, 32*2)
        game.debug.text("Next BPM: "+this.musicBeatObj.nextBpm, 32, 32*2.5)
        game.debug.text("Current track time divisible by BPM: "+this.musicBeatObj.timeOfBPM, 32, 32*3)
        */

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

        game.debug.text("Quality of my Sixteenth Timing: "+this.sixteenthTimeQuality, 32, 32)
        game.debug.text("Quality of my Eighth Timing: "+this.eighthTimeQuality, 32, 32*1.5)
        game.debug.text("Quality of my Quarter Timing: "+this.quarterTimeQuality, 32, 32*2)

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