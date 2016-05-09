var Splash = function(){},
    controls = {};

Splash.prototype = {
    init: function(){
        this.loadingBar = game.make.sprite(0, 500, 'sidewalk');
        this.title = game.make.sprite(game.world.centerX, 150, 'logo');
        this.loadStatus = game.make.text(game.world.centerX, 350, "Loading...", {fill: 'white'});
        utils.centerGameObjects([this.title, this.loadStatus]);
        this.currentTrack = tracks.ivy;
    },
    loadScripts: function(){
        game.load.script('thegame', 'assets/js/states/thegame.js');
        game.load.script('music', 'assets/js/music.js');
        game.load.script('actions', 'assets/js/actions.js');
        game.load.script('hungry', 'assets/js/hungry.js');
        game.load.script('food', 'assets/js/food.js');
        game.load.script('beats', 'assets/js/beats.js');
    },
    loadBgm: function(){
        game.load.audio('witit', 'assets/mp3/witit.mp3');
        game.load.audio('work', 'assets/mp3/work.mp3');
        game.load.audio('carlos', 'assets/mp3/carlos.mp3');
        game.load.audio('notype', 'assets/mp3/notype.mp3');
        game.load.audio('btstu', 'assets/mp3/btstu.mp3');
        game.load.audio('realiti', 'assets/mp3/realiti.mp3');
        game.load.audio('ivy', 'assets/mp3/ivy.mp3');
    },
    loadImages: function(){
        game.load.image('grill', 'assets/img/grill.png');
    },
    createMusic: function(){
        music.bgm = game.add.audio(this.currentTrack.name);
        music.bgm.play();
    },
    createControls: function(){
        controls.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        controls.A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        controls.D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        controls.UP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        controls.SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        controls.F = game.input.keyboard.addKey(Phaser.Keyboard.F);
        controls.P = game.input.keyboard.addKey(Phaser.Keyboard.P);

        controls.P.onUp.add(gofull)
        controls.W.onDown.addOnce(function(){game.state.start('Game');});
        controls.UP.onDown.addOnce(function(){game.state.start('Game');});
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

        this.createMusic();
        this.createControls();
        game.state.add('Game', Game);
    }
}