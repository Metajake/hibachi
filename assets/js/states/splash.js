var Splash = function(){},
	playSound = true,
	playMusic = true,
	controls = {},
	music = {};

Splash.prototype = {
	loadScripts: function(){
		game.load.script('webfont', 'assets/js/webfontloader.js')
		game.load.script('gamemenu', 'assets/js/states/gamemenu.js');
		game.load.script('thegame', 'assets/js/states/thegame.js');
		// game.load.script('gameover', 'assets/js/states/gameover.js');
		// game.load.script('credits', 'assets/js/states/credits.js');
		// game.load.script('options', 'assets/js/states/options.js');
	},
	
	loadBgm: function(){
		game.load.audio('rattrap', '../assets/mp3/rattrap.mp3');
		game.load.audio('work', '../assets/mp3/work.mp3');
		game.load.audio('witit', '../assets/mp3/witit.mp3');
	},
	
	loadImages: function(){
		game.load.image('spatula', '../assets/img/spatula.png');
		game.load.image('lamppost', '../assets/img/lamppost.png')
		game.load.image('chickenLeg', '../assets/img/chicken_leg.png');
		game.load.spritesheet('dancer', 'assets/img/breakdancer.png', 32, 32);
	},
	
	loadFonts: function(){
		WebFontConfig = {
	      	custom: {
	        families: ['IrishGrover'],
	        urls: ['assets/css/fonts.css']
	      }
	    }
	},
	
	addGameStates: function(){
		game.state.add("GameMenu", GameMenu);
		game.state.add("Game", Game);
		// game.state.add("GameOver", GameOver);
		// game.state.add("Credits", Credits);
		// game.state.add("Options", Options);
	},
	
	addGameMusic: function(){
		music.track = game.add.audio('witit');
		music.bpm = 857;
		// music.loop = true;
		music.track.play();
	},

	init: function(){
		this.loadingBar = game.make.sprite(0, 500, 'sidewalk');
		this.logo = game.make.sprite(game.world.centerX, 150, 'logo');
		this.loadStatus = game.make.text(game.world.centerX, 350, 'Loading...', {fill: 'white'});
		utils.centerGameObjects([this.logo, this.loadStatus]);
	},
	
	add_controls: function (){
		controls.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		controls.step = game.input.keyboard.addKey(Phaser.Keyboard.F);
		controls.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
		controls.B = game.input.keyboard.addKey(Phaser.Keyboard.B);
		controls.mince = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		controls.dice = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		controls.slice = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		controls.mix = game.input.keyboard.addKey(Phaser.Keyboard.A);
		controls.flip = game.input.keyboard.addKey(Phaser.Keyboard.D);
		controls.pose = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		
		controls.W.onDown.addOnce(function(){game.state.start('Game');});
		controls.mince.onDown.addOnce(function(){game.state.start('Game');});
	},
	
	preload: function(){
		sky_bg();
		game.add.existing(this.logo).scale.setTo(0.75);
		game.add.existing(this.loadingBar).scale.setTo(1,0.75);
		game.add.existing(this.loadStatus);
		this.load.setPreloadSprite(this.loadingBar);

		this.loadScripts();
		this.loadImages();
		this.loadFonts();
		this.loadBgm();
	},
	
	create: function(){
		this.loadStatus.setText('Ready!');
		this.startLabel = game.make.text(game.world.centerX, 450, 'Press W or UP', {fill: 'white'});
		utils.centerGameObjects([this.startLabel]);
		game.add.existing(this.startLabel);
		
		this.addGameStates();
		this.addGameMusic();
		this.add_controls();
	}
}