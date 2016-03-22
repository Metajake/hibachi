var game = new Phaser.Game(800, 600, Phaser.AUTO),
	Main = function(){};

Main.prototype = {
	preload: function(){
		game.load.image('sidewalk', '../assets/img/sidewalk.png');
		game.load.image('logo', '../assets/img/logo.png');
		game.load.script('utils', 'assets/js/utils.js');
		game.load.script('splash', 'assets/js/states/splash.js');
		game.load.script('graphics', 'assets/js/graphics.js');
	},
	
	create: function(){
		game.state.add('splash', Splash);
		// game.state.add('game', Game);
		game.state.start('splash');
	}
};
game.state.add('main', Main);
game.state.start('main');