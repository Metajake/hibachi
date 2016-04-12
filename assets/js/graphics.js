function gradient_bg(startHex, endHex){
    var out = [];
    var sky = game.add.bitmapData(gameWidth, gameHeight);
    sky.addToWorld();
    var skyY = 0;
    for (var i = 0; i < gameHeight; i++) {
        var c = Phaser.Color.interpolateColor(startHex, endHex, 330, i);
        sky.rect(0, skyY, 800, skyY+2, Phaser.Color.getWebRGB(c));
        out.push(Phaser.Color.getWebRGB(c));
        skyY += 2;
    }
}

function Spritesheet(x,y,key){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    return this.sprite
}
function Dancer(x, y){
    this.sprite = new Spritesheet(x,y,'dancer');
    this.sprite.scale.setTo(4.5,4.5);
    this.sprite.animations.add('idle', [0,1,2,1]);
    this.sprite.animations.play('idle',3,true)
}
function Cube(x, y){
    this.sprite = new Spritesheet(x,y,'cube');
    this.sprite.scale.setTo(4,4);
    this.sprite.animations.add('spin');
    this.sprite.animations.play('spin',6,true);
    this.sprite.animations.currentAnim.speed = 15;
}

function BmpRect(x, y){
    bmd = game.add.bitmapData(128,128);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 30,8);
    bmd.ctx.fillStyle = "#aaa";
    bmd.ctx.fill();
    return bmd;
}

function BmpCirc(x, y, size, color){
    circ = game.add.bitmapData(x+128,y+128);
    circ.circle(x, y, size,color);
    //circSpr = game.add.sprite(x, y, circ);
    return circ;
}

function SlidingIndicator(x,y,distance,sprite){
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.sprite = sprite;
    this.indicators = game.add.group();

    this.indicate = function(duration){
        this.indicators.create(x,y,sprite);
        m1 = game.add.tween(this.indicators.getTop());
        m1.to({y:y+this.distance}, duration,Phaser.Easing.Linear.None);
        m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
        m1.start()
    }
}

function Flasher(x, y, displayObj, tint){
    this.sprite = game.add.sprite(x,y,displayObj);
    if(tint){this.sprite.tint = tint;}else{}
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(2,2);
    this.sprite.alpha = 0.1;
};

Flasher.prototype.glow = function(duration){
    f1 = game.add.tween(this.sprite);
    f2 = game.add.tween(this.sprite);
    f1.to({alpha:1},duration,Phaser.Easing.Linear.None);
    f2.to({alpha:0.1},duration *.07,Phaser.Easing.Linear.None);
    f1.chain(f2);
    f1.start();
}

Flasher.prototype.flash = function(duration){
    f1 = game.add.tween(this.sprite);
    f2 = game.add.tween(this.sprite);
    f1.to({alpha:1},duration,Phaser.Easing.Linear.None);
    f2.to({alpha:0.1},duration,Phaser.Easing.Linear.None);
    f1.chain(f2);
    f1.start();
};

function IndicatorManager(x,y){
    this.constructSliders = function(){
        this.rectSprite = new BmpRect();
        this.startingLine = new Phaser.Line(x,y,x+150,y);
        this.sLine = new Phaser.Line(x,y+75,x+150,y+75);
        this.eLine = new Phaser.Line(x,y+50,x+150,y+50);
        this.qLine = new Phaser.Line(x,y+100,x+150,y+100);


        this.qs = new SlidingIndicator(x+95,y-4, 100,this.rectSprite);
        this.es = new SlidingIndicator(x+55,y+46, 50,this.rectSprite);
        this.ss = new SlidingIndicator(x+15,y+71, 25,this.rectSprite);
    };
    this.constructFlashers = function(x,y){
        this.c1 = BmpCirc(80,100,12,"#000");
        this.c2 = BmpCirc(80,100,12,"#00f");
        this.c3 = BmpCirc(80,100,12,"#ff0");
        this.sf = new Flasher(x,y, this.c1);
        this.ef = new Flasher(x+100,y, this.c2);
        this.qf = new Flasher(x+200,y, this.c3);
    }
}