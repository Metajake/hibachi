var gameWidth = 800,
    gameHeight = 600,
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO),
    Main = function(){};

Main.prototype = {
    preload: function(){
        game.load.script('utils', 'assets/js/utils.js');
        game.load.script('stage', 'assets/js/stage.js');
        game.load.script('trackInfo', 'assets/js/trackInfo.js');
        game.load.script('splash', 'assets/js/states/splash.js');
        game.load.script('graphics', 'assets/js/graphicUtils.js');
        game.load.script('gMeasurements', 'assets/js/gMeasurements.js');
        game.load.script('typography', 'assets/js/typography.js');
        game.load.script('input', 'assets/js/inputConductor.js');
        game.load.script('sound', 'assets/js/sound.js');

        game.load.image('sidewalk', 'assets/img/sidewalk.png');
        game.load.image('logo', 'assets/img/logo.png');
        game.load.image('grill', 'assets/img/grill.png');
        game.load.image('circle', 'assets/img/greyElipse.png');
        game.load.image('iconTrick', 'assets/img/iconTrickKnife.png');
        game.load.image('iconBaseFood', 'assets/img/iconBaseFood.png');
        game.load.image('iconServe', 'assets/img/iconServe.png');
        game.load.image('iconAdvancedTrick', 'assets/img/iconAdvancedTrick.png');
        game.load.image('buttonW', 'assets/img/buttonW.png');
        game.load.image('buttonD', 'assets/img/buttonD.png');
        game.load.image('buttonUP', 'assets/img/buttonUP.png');
        game.load.image('buttonLEFT', 'assets/img/buttonLEFT.png');
        game.load.image('buttonS', 'assets/img/buttonS.png');
        game.load.image('buttonF', 'assets/img/buttonF.png');
        game.load.image('buttonG', 'assets/img/buttonG.png');
        game.load.image('midBg', 'assets/img/midBg.png');
        game.load.spritesheet('grillMini', 'assets/img/grill_mini.png', 32,32);
        game.load.spritesheet('noodles', 'assets/img/noodles4.png', 50,50);
        game.load.spritesheet('chefPortrait', 'assets/img/chef.png', 48,48);
        game.load.spritesheet('walkerGuy', 'assets/img/walkLeft_guy.png', 64,64);
        game.load.spritesheet('oilPour', 'assets/img/oilPour.png', 129,129);
        game.load.spritesheet('fireFromOil', 'assets/img/fireFromOil.png', 153,153);
        game.load.spritesheet('hungryMid', 'assets/img/hungryMid.png', 48,48);
        game.load.spritesheet('leftHand', 'assets/img/leftHand.png', 48,48);

        game.load.audio('ivy', 'assets/mp3/ivy.mp3');
        game.load.audio('hype', 'assets/mp3/hype.mp3');
        game.load.audio('pli', 'assets/mp3/pli.ogg');
        game.load.audio('enter', 'assets/mp3/enterTheNinja.mp3');
        game.load.audio('work', 'assets/mp3/work.mp3');
        game.load.audio('btstu', 'assets/mp3/btstu.mp3');
        game.load.audio('yamborghini', 'assets/mp3/yamborghini.mp3');
        game.load.audio('iDriveBy', 'assets/mp3/iDriveBy.mp3');

        game.load.audio('shking_soft_short1', 'assets/mp3/effects/shking_soft_short1.mp3');
        game.load.audio('sharpen_long1', 'assets/mp3/effects/sharpen_long1.mp3');
        game.load.audio('sharpen_long2', 'assets/mp3/effects/sharpen_long2.mp3');
        game.load.audio('sharpen_long3', 'assets/mp3/effects/sharpen_long3.mp3');
        game.load.audio('sharpen_short1', 'assets/mp3/effects/sharpen_short1.mp3');
        game.load.audio('sharpen_short2', 'assets/mp3/effects/sharpen_short2.mp3');
        game.load.audio('sizzle01', 'assets/mp3/effects/sizzle01.mp3');

        game.load.bitmapFont('carrierCommand', 'assets/font/carrierCommand.png', 'assets/font/carrierCommand.xml');

    },
    create: function(){
        game.state.add('splash', Splash);
        game.state.start('splash');
    }
};
game.state.add('main', Main);
game.state.start('main');