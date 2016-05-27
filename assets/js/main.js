var gameWidth = 800,
    gameHeight = 600,
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO),
    Main = function(){};

Main.prototype = {
    preload: function(){
        game.load.script('utils', 'assets/js/utils.js');
        game.load.script('graphics', 'assets/js/graphics.js');
        game.load.script('music', 'assets/js/music.js');
        game.load.script('splash', 'assets/js/states/splash.js');
        game.load.script('gIndicators', 'assets/js/gIndicators.js');
        game.load.script('gMeasurements', 'assets/js/gMeasurements.js');
        game.load.script('typography', 'assets/js/typography.js');

        game.load.image('sidewalk', 'assets/img/sidewalk.png');
        game.load.image('logo', 'assets/img/logo.png');
        game.load.image('grill', 'assets/img/grill.png');
        game.load.spritesheet('grillMini', 'assets/img/grill_mini.png', 32,32);
        game.load.spritesheet('noodles', 'assets/img/noodles4.png', 50,50);
        game.load.spritesheet('chef', 'assets/img/chef.png', 48,48);
        game.load.spritesheet('buttons', 'assets/img/buttons.png', 32, 32);
        game.load.spritesheet('walkerGuy', 'assets/img/walkLeft_guy.png', 64,64);
        //game.load.spritesheet('wadKeys', 'assets/img/wadKeys.png', 64,64);
        //game.load.spritesheet('keyboard', 'assets/img/keyboard.png', 32, 32);

        game.load.audio('ivy', 'assets/mp3/ivy.mp3');
        game.load.audio('hype', 'assets/mp3/hype.mp3');
        game.load.audio('pli', 'assets/mp3/pli.ogg');
        game.load.audio('enter', 'assets/mp3/enterTheNinja.mp3');
        game.load.audio('work', 'assets/mp3/work.mp3');

        game.load.audio('shking_soft_short1', 'assets/mp3/effects/shking_soft_short1.mp3');
        game.load.audio('sharpen_long1', 'assets/mp3/effects/sharpen_long1.mp3');
        game.load.audio('sharpen_long2', 'assets/mp3/effects/sharpen_long2.mp3');
        game.load.audio('sharpen_long3', 'assets/mp3/effects/sharpen_long3.mp3');
        game.load.audio('sharpen_short1', 'assets/mp3/effects/sharpen_short1.mp3');
        game.load.audio('sharpen_short2', 'assets/mp3/effects/sharpen_short2.mp3');

        game.load.bitmapFont('carrierCommand', 'assets/font/carrierCommand.png', 'assets/font/carrierCommand.xml');

    },
    create: function(){
        game.state.add('splash', Splash);
        game.state.start('splash');
    }
}
game.state.add('main', Main);
game.state.start('main');