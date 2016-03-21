var Splash = function(){},
	playSound = true,
	playMusic = true,
	music, mince;

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
		music = game.add.audio('witit');
		music.loop = true;
		music.play();
	},

	init: function(){
		this.loadingBar = game.make.sprite(0, 500, 'sidewalk');
		this.logo = game.make.sprite(game.world.centerX, 150, 'logo');
		this.loadStatus = game.make.text(game.world.centerX, 350, 'Loading...', {fill: 'white'});
		utils.centerGameObjects([this.logo, this.loadStatus]);
	},
	
	preload: function(){
		make_sky_bg();
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
		this.start = game.make.text(game.world.centerX, 450, 'Press R or UP', {fill: 'white'});
		utils.centerGameObjects([this.start]);
		game.add.existing(this.start);
		
		this.addGameStates()
		this.addGameMusic()
		
		mince = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		mince.onDown.addOnce(function(){
			game.state.start('Game');
		});
// 		}
	}
}