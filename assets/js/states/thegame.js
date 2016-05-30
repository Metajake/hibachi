Game = function(){};

Game.prototype = {
    init: function(){
        music.bgm.stop();
        this.trackInfo = tracks.enter;
        this.soundAnalyse = game.plugins.add(new Phaser.Plugin.SoundAnalyse(game));
    },
    loadAudio: function(){
        music.bgm = game.add.audio(this.trackInfo.name);
        music.bgm.volume = this.trackInfo.volume;
        music.bgm.onStop.add(function(){game.playing = false;});

        this.sm = new SoundManager();
        this.sm.constructSounds();
    },
    loadControls: function(){
        //this.w = controls.W.onDown.add(function(){actionOne(this.musicObj.beat32, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        //this.up = controls.UP.onDown.add(function(){actionOne(this.musicObj.beat16, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        //this.d = controls.D.onDown.add(function(){actionOne(this.musicObj.beat8, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        //this.left = controls.LEFT.onDown.add(function(){actionOne(this.musicObj.beat4, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        this.space = controls.SPACE.onDown.add(pause_game, this);
        this.g = controls.G.onDown.add(step_game);
        this.p = controls.P.onUp.add(gofull)
    },
    createElements: function(){

        this.stage = new LevelStage(game.stage, this.soundAnalyseSprite);
        //
        //this.soundAnalyseSprite = this.soundAnalyse.add.soundAnalyseSprite(0, 0, 800, 600, this.trackInfo.name, true, this._onDecodeFinish, this);
        //this.soundAnalyseSprite.showFrequencyDomainChartBars(true);
        //this.soundAnalyseSprite.mask = this.stage.cropRectD;
        //
        this.im = new IndicatorManager(this.stage);

        this.chef = new Chef(this.stage);

        this.hm = new HungryManager(this.stage, this.chef);

        this.tm = new TextManager(this.stage);
        //circle = game.add.sprite(400, 300, 'circle');
        //circle.anchor.setTo(0.5,0.5)
        //circle.tint = 0xff0000

        this.ic = new InputConductor(this.stage, this.chef);

        this.musicObj = new MusicObj(this.trackInfo, this.stage, this.im, this.hm,  music.bgm.currentTime, this.ic);

        this.ic.inputOne = this.ic.createEnsemble(this.ic, this.stage.p1.x,this.stage.p1.y, '#000', 20, 1, controls.W, this.musicObj.beat32, this.hm, this.musicObj, this.chef, this.sm, this.tm, "trick");
        this.ic.inputTwo = this.ic.createEnsemble(this.ic, this.stage.p3.x,this.stage.p3.y, '#f0f', 40, 0, controls.UP, this.musicObj.beat16, this.hm, this.musicObj, this.chef, this.sm, this.tm, "ingredient");

        game.world.bringToTop(this.tm.resultIndicator.indicators);


    },
    startRhythm: function(){
        this.stageTimer = game.time.create(false);

        music.bgm.play();
        this.stageTimer.start();

        //music.bgm.onPlay.add(function(){
            //this.ic.inputOne.si.indicate(this.musicObj.beat32.duration);
            //this.ic.inputTwo.si.indicate(this.musicObj.beat16.duration);
            //this.im.es.indicate(this.musicObj.beat8.duration);
            //this.im.qs.indicate(this.musicObj.beat4.duration);
            //tweenTint(this.stage.bgSprite, 0xff0000,0xee7777, this.bpm *.5)
        //},this);
    },
    preload: function(){
        this.loadControls();
        this.loadAudio();
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
        }

        //actionOne(this.musicObj.beat32, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyW")
        //actionOne(this.musicObj.beat16, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowUp")
        //actionOne(this.musicObj.beat8, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyD")
        //actionOne(this.musicObj.beat4, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowLeft")
    },
    render: function(){
        //game.debug.geom(this.stage.p1);
        //game.debug.geom(this.stage.p2);
        //game.debug.geom(this.stage.p3);
        //game.debug.geom(this.im.leftStart);

        game.debug.text("Grill Rep: "+this.chef.grill.rep, 32, 32);
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

        //game.debug.text("Accepting Input?.. "+this.acceptingInput, 32, 32*12)
    }
}