var Splash = function(){},
    controls = {};

Splash.prototype = {
    init: function(){
        this.loadingBar = game.make.sprite(0, 500, 'sidewalk');
        this.title = game.make.sprite(game.world.centerX, 150, 'logo');
        this.loadStatus = game.make.text(game.world.centerX, 350, "Loading...", {fill: 'white'});
        utils.centerGameObjects([this.title, this.loadStatus]);
        this.currentTrack = music.work;
    },
    loadScripts: function(){
        game.load.script('thegame', 'assets/js/states/thegame.js');
    },
    loadBgm: function(){
        game.load.audio('witit', 'assets/mp3/witit.mp3');
        game.load.audio('work', 'assets/mp3/work.mp3')
    },
    loadImages: function(){
        game.load.image('chickenleg', 'assets/img/chicken_leg.png');
        game.load.spritesheet('dancer', 'assets/img/breakdancer.png', 32, 32);
    },
    createMusic: function(){
        music.bgm = game.add.audio(this.currentTrack.name);
        music.bgm.play();
    },
    createControls: function(){
        controls.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        controls.UP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        controls.SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        controls.F = game.input.keyboard.addKey(Phaser.Keyboard.F);

        controls.W.onDown.addOnce(function(){game.state.start('Game');});
        controls.UP.onDown.addOnce(function(){game.state.start('Game');});
    },
    preload: function(){
        gradient_bg(0x0D51a8, 0xe7a36E);
        game.add.existing(this.title).scale.setTo(0.75);
        game.add.existing(this.loadingBar).scale.setTo(1, 0.75);
        game.add.existing(this.loadStatus);
        this.load.setPreloadSprite(this.loadingBar);
        this.loadScripts();
        this.loadImages();
        this.loadBgm();
    },
    create: function(){
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