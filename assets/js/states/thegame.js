//The Engine of our game. Contains native Phaser operational states.
//Instantiated and started from 'states/splash.js'
Game = function(){};

Game.prototype = {
    //!------IMPORTANT-------! INIT, PRELOAD, CREATE, UPDATE, and RENDER are 4 native Phaser States...
    //... They will be executing IN ORDER as the game loads. UPDATE and RENDER repeat.
    //
    //Phaser native INIT state. Set some definitions before anything else runs.
    init: function(){
        //Stop Background Music from Title/Load screen
        music.bgm.stop();
        //Define Current Level music selection (to be determined by Menu Screen selection in the future).
        this.trackInfo = tracks.enter;
    },
    //Called from PRELOAD
    loadAudio: function(){
        //Add Background Music to Current Level
        music.bgm = game.add.audio(this.trackInfo.name);
        music.bgm.volume = this.trackInfo.volume;
        //When Background Music finishes, set Game Playing to false (returning player to Title Screen)
        music.bgm.onStop.add(function(){game.playing = false;});

        //Define Sound Manager. This manages sound effects
        this.sm = new SoundManager();
        //Construct sound effects. See 'sound.js'
        this.sm.constructSounds();
    },
    //Called from PRELOAD. Loads up the input controls for our game Level
    loadControls: function(){
        //Up, Left, W, and D keys perform same action depending on first argument...
        //... the provided "beat object" (to be instantiated later in our code).
        controls.W.onDown.add(function(){actionOne(this.musicObj.beat32, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.UP.onDown.add(function(){actionOne(this.musicObj.beat16, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.D.onDown.add(function(){actionOne(this.musicObj.beat8, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        controls.LEFT.onDown.add(function(){actionOne(this.musicObj.beat4, this.hm, this.musicObj.theTime, this.chef, this.sm, this.tm);}, this);
        //Spacebar: Pause Game (ALT+Spacebar: Pause Game and frames can be stepped through)
        controls.SPACE.onDown.add(pause_game, this);
        //G Key: Step through frames during Game Paused. For Debug purposes.
        controls.G.onDown.add(step_game);
        //ALT+P Activate full screen mode
        controls.P.onUp.add(gofull)
    },
    //Called from CREATE. Instantiates all of our main game objects (Stage graphics,
    //Music note indicators, Chef, Customers, Text).
    createElements: function(){
        //Phaser has a game.Stage() object. I don't conflict with that. This.stage is just for the
        //windows, background graphics, points of interest. See 'stage.js'
        //I send this.stage Game.Stage as an argument for reference to spacial information.
        this.stage = new LevelStage(game.stage);

        //Instantiate Indicator Manager. This displays the music notes with sliding, flashing indicators
        this.im = new IndicatorManager(this.stage);

        //Instantiate Chef Object (Food Manager). This organizes recipes, food being cooked
        this.chef = new Chef(this.stage);

        //Instantiate "Hungry" Object (Customer Manager). This organizes customers orders, satisfaction.
        this.hm = new HungryManager(this.stage, this.chef);

        //Instantiate Text Manager. This organizes text on the screen.
        this.tm = new TextManager(this.stage);
    },
    //Called from CREATE. This is the LAST THING Phaser calls before UPDATE. It basically STARTS the level.
    startRhythm: function(){
        //Sometimes I want to know how long the Level has been active so I have this timer to run that duration.
        this.stageTimer = game.time.create(false);

        //Instantiate Music Object (music beat timing manager). This is the main feature of the game.
        //It keeps track of all the music, beats, the beat timing, note indicators,
        //and determines the timing of our input "goal".
        this.musicObj = new MusicObj(this.trackInfo, this.stage, this.im, this.hm,  music.bgm.currentTime)

        //Play the music and start any timers
        music.bgm.play();
        this.stageTimer.start();

        //On Level Background Music.PLAY, execute the initial indicators (musicObj will do this after the first time).
        music.bgm.onPlay.add(function(){
            this.im.ts.indicate(this.musicObj.beat32.duration);
            this.im.ss.indicate(this.musicObj.beat16.duration);
            this.im.es.indicate(this.musicObj.beat8.duration);
            this.im.qs.indicate(this.musicObj.beat4.duration);
        },this);
    },
    //Phaser native PRELOAD state. Preloads our assets.
    preload: function(){
        this.loadControls();
        this.loadAudio();
    },
    //Phaser native CREATE state. Creates Level elements.
    create: function(){
        //Prevents Music from stopping when browser tab looses focus
        game.stage.disableVisibilityChange = true;
        //Set Game Playing Bool to true. If false: Game Over.
        game.playing = true;

        this.createElements();
        this.startRhythm();
    },
    //Phaser native UPDATE state. Executed repeatedly as fast as possible.
    update: function(){
        //Update music object based on current time of Background Music. See 'beats.js'
        this.musicObj.update(music.bgm.currentTime);

        //Always check if Game Playing bool is true. Otherwise "game over" (return to title screen).
        if(game.playing == false){
            game.state.start('splash');
        }

        //Uncomment these for debugging Input. It's like pressing an input button as fast as the computer can.
        //This lets us see the "quality of the timing of the input" as fast as the computer can go. The purpose
        //is to check the timing of our indicators, see if they make sense with the "quality results" we are getting.
        //actionOne(this.musicObj.beat32, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyW")
        //actionOne(this.musicObj.beat16, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowUp")
        //actionOne(this.musicObj.beat8, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "KeyD")
        //actionOne(this.musicObj.beat4, this.hm, music.bgm.currentTime, this.chef, this.sm, this.tm, "ArrowLeft")
    },
    //Phaser native RENDER state. Gets called every "cycle" after update.
    render: function(){
        //DEBUG: visualizing some placeholder graphical elements
        game.debug.geom(this.stage.p1)
        game.debug.geom(this.stage.p2)
        game.debug.geom(this.stage.p3)
        game.debug.geom(this.im.leftStart)

        //DEBUG: the reputation value of the Chef's grill.
        game.debug.text("Grill Rep: "+this.chef.grill.rep, 32, 32);
        //For each "hungry" in "hungry crowd" check their "fed level", etc.
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