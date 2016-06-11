var Splash = function(){},
    controls = {};

Splash.prototype = {
    init: function(){
        this.stageTimer = game.time.create(false);

        this.loadingBar = game.make.sprite(0, 500, 'sidewalk');
        this.title = game.make.sprite(game.world.centerX, 150, 'logo');
        this.loadStatus = game.make.text(game.world.centerX, 350, "Loading...", {fill: 'white'});
        utils.centerGameObjects([this.title, this.loadStatus]);
        this.currentTrack = tracks.btstu;
    },
    loadScripts: function(){
        game.load.script('thegame', 'assets/js/states/thegame.js');
        game.load.script('hungry', 'assets/js/hungry.js');
        game.load.script('food', 'assets/js/food.js');
        game.load.script('beats', 'assets/js/beats.js');
        game.load.script('analyser', 'assets/js/vendor/soundAnalyse.js');
    },
    loadBgm: function(){
        game.load.audio('witit', 'assets/mp3/witit.mp3');
        game.load.audio('carlos', 'assets/mp3/carlos.mp3');
        game.load.audio('rattrap', 'assets/mp3/rattrap.mp3');
        game.load.audio('notype', 'assets/mp3/notype.mp3');
        game.load.audio('realiti', 'assets/mp3/realiti.mp3');
        game.load.audio('mch', 'assets/mp3/mch.mp3');
    },
    loadImages: function(){


    },
    createMusic: function(){
        music.bgm = game.add.audio(this.currentTrack.name);
        music.bgm.volume = .5
        music.bgm.play();

    },
    createControls: function(){
        controls.W = {control:game.input.keyboard.addKey(Phaser.Keyboard.W),key:"buttonW"};
        controls.A = {control:game.input.keyboard.addKey(Phaser.Keyboard.A),key:"buttonA"};
        controls.S = {control:game.input.keyboard.addKey(Phaser.Keyboard.S),key:"buttonS"};
        controls.D = {control:game.input.keyboard.addKey(Phaser.Keyboard.D),key:"buttonD"};
        controls.E = {control:game.input.keyboard.addKey(Phaser.Keyboard.E),key:"buttonE"};
        //DONT STEAL R FROM BROWSER controls.R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        controls.G = {control:game.input.keyboard.addKey(Phaser.Keyboard.G),key:"buttonG"};
        controls.UP = {control:game.input.keyboard.addKey(Phaser.Keyboard.UP),key:"buttonUP"};
        controls.LEFT = {control:game.input.keyboard.addKey(Phaser.Keyboard.LEFT),key:"buttonLEFT"};
        //controls.RIGHT = {control:game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),key:"buttonRIGHT"};
        controls.DOWN = {control:game.input.keyboard.addKey(Phaser.Keyboard.DOWN),key:"buttonDOWN"};
        controls.SPACE = {control:game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),key:"buttonSPACE"};
        controls.F = {control:game.input.keyboard.addKey(Phaser.Keyboard.F),key:"buttonF"};
        controls.P = {control:game.input.keyboard.addKey(Phaser.Keyboard.P),key:"buttonP"};

        controls.P.control.onUp.add(gofull);
        controls.W.control.onDown.addOnce(function(){game.state.start('Game');});
        controls.UP.control.onDown.addOnce(function(){game.state.start('Game');});
    },
    preload: function(){
        this.sky = gradient_bg(0x0D51a8, 0xe7a36E);
        this.sky.addToWorld();
        game.add.existing(this.title).scale.setTo(0.75);
        game.add.existing(this.loadingBar).scale.setTo(1, 0.75);
        game.add.existing(this.loadStatus);
        this.load.setPreloadSprite(this.loadingBar);
        this.loadScripts();
        this.loadImages();
        this.loadBgm();
    },
    create: function(){
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.stage.disableVisibilityChange = true;
        this.loadStatus.setText("Ready!");
        this.startLabel = game.make.text(game.world.centerX, 450, 'Press W or UP', {fill: 'white'});
        utils.centerGameObjects([this.startLabel]);
        game.add.existing(this.startLabel);

        this.stageTimer.start();
        this.createMusic();
        this.createControls();
        game.state.add('Game', Game);
    }
}