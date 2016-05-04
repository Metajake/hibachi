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

function Stage(stage){
    this.stage = stage;
    this.stage.backgroundColor = 0xfe3333;
}

Stage.prototype.constructWindows = function(origin){
    this.originX = origin;
    this.originY = origin;
    this.margin = 5;
    this.winWidth = game.stage.width-origin*2;
    this.winHeight = game.stage.height-origin*2;
    this.winABmp = new BmpRect(this.winWidth *.3,this.winHeight *.2, "#ddd");
    this.windowA = game.add.sprite(this.originX,this.originY,this.winABmp);
    this.winBBmp = new BmpRect(this.winWidth *.7-this.margin,this.winHeight *.2, "#ddd");
    this.windowB = game.add.sprite(this.winWidth *.3+this.margin*2,this.originY,this.winBBmp);
    this.winCBmp = new BmpRect(this.winWidth,this.winHeight *.6-this.margin*3, "#88c");
    this.windowC = game.add.sprite(this.originX,this.winHeight *.2+this.margin*2,this.winCBmp);
    this.winDBmp = new BmpRect(this.winWidth,this.winHeight *.2+this.margin, "#ddd");
    this.windowD = game.add.sprite(this.originX,this.winHeight*.8,this.winDBmp);
}

Stage.prototype.update = function(){

}

function FoodSprite(x,y,key, speed, scale, cropRect){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(scale, scale);
    this.boundingBox = game.add.graphics();
    this.boundingBox.beginFill(0x000000);
    this.boundingBox.drawRect(cropRect.originX,cropRect.winHeight *.2+cropRect.margin*2,cropRect.winWidth,cropRect.winHeight *.6 - cropRect.margin*3)
    this.sprite.mask = this.boundingBox;
    this.sprite.animations.add('idle');
    this.sprite.animations.play('idle',speed,true);
    return this.sprite
}
function Dancer(x, y){
    this.sprite = new FoodSprite(x,y,'dancer');
    this.sprite.scale.setTo(4.5,4.5);
    this.sprite.animations.add('idle', [0,1,2,1]);
    this.sprite.animations.play('idle',3,true)
}
function Cube(x, y){
    this.sprite = new FoodSprite(x,y,'cube');
    this.sprite.scale.setTo(4,4);
    this.sprite.animations.add('spin');
    this.sprite.animations.play('spin',6,true);
    this.sprite.animations.currentAnim.speed = 10;
}

function BmpRect(width, height, color){
    bmd = game.add.bitmapData(800,600);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0, width, height);
    bmd.ctx.fillStyle = color;
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
    this.sprite.alpha = 0.0; //CHANGE BACK TO 0.1 to see INDICATOR Before Flashing
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
    this.x = x;
    this.y = y;
};

IndicatorManager.prototype.constructFlashers = function(x, y){
    this.c1 = BmpCirc(80,100,12,"#000");
    this.c2 = BmpCirc(80,100,12,"#00f");
    this.c3 = BmpCirc(80,100,12,"#ff0");
    this.c4 = BmpCirc(80,100,12,"#f0f");
    this.sf = new Flasher(x,y, this.c1);
    this.ef = new Flasher(x+100,y, this.c2);
    this.qf = new Flasher(x+200,y, this.c3);
    this.mbf = new Flasher(x,y-100, this.c4);
};

IndicatorManager.prototype.constructSliders = function(){
    this.rectSprite = new BmpRect(0,0,30,8, "#aaa");
    this.startingLine = new Phaser.Line(this.x,this.y,this.x+150,this.y);
    this.sLine = new Phaser.Line(this.x,this.y+75,this.x+150,this.y+75);
    this.eLine = new Phaser.Line(this.x,this.y+50,this.x+150,this.y+50);
    this.qLine = new Phaser.Line(this.x,this.y+100,this.x+150,this.y+100);


    this.qs = new SlidingIndicator(this.x+95,this.y-4, 100,this.rectSprite);
    this.es = new SlidingIndicator(this.x+55,this.y+46, 50,this.rectSprite);
    this.ss = new SlidingIndicator(this.x+15,this.y+71, 25,this.rectSprite);
};

IndicatorManager.prototype.constructExpectingFlashers = function(x, y){
    this.sef = new Flasher(x,y, 'chickenleg', 0x0000ff);
    this.eef = new Flasher(x+100,y, 'chickenleg', 0xff0000);
    this.qef = new Flasher(x+200, y, 'chickenleg', 0x00ff00);
}