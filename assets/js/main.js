var gameWidth = 800,
    gameHeight = 600,
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO),
    Main = function(){};

Main.prototype = {
    preload: function(){
        game.load.image('sidewalk', 'assets/img/sidewalk.png');
        game.load.image('logo', 'assets/img/logo.png');
        game.load.audio('clang1', ['assets/mp3/effects/metal_clang1.mp3']);
        game.load.script('utils', 'assets/js/utils.js');
        game.load.script('graphics', 'assets/js/graphics.js');
        game.load.script('music', 'assets/js/music.js');
        game.load.script('splash', 'assets/js/states/splash.js');
    },
    create: function(){
        log("creating main")
        game.state.add('splash', Splash);
        game.state.start('splash');
    }
}
game.state.add('main', Main);
game.state.start('main');