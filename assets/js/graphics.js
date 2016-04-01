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

function Flasher(tint, x, y){
    this.sprite = game.add.sprite(x,y,'chickenleg');
    this.sprite.tint = tint;
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(2,2)
    this.sprite.alpha = 0.1;
    this.flash = function(duration){
        f1 = game.add.tween(this.sprite)
        f2 = game.add.tween(this.sprite)
        f1.to({alpha:1},duration,Phaser.Easing.Linear.None);
        f2.to({alpha:0.1},duration *.07,Phaser.Easing.Linear.None);
        f1.chain(f2);
        f1.start();
    }
}

function Dancer(x, y){
    this.dancer = game.add.sprite(x,y,'dancer');
    this.dancer.smoothed = false;
    this.dancer.scale.setTo(4.5,4.5);
    this.dancer.animations.add('idle', [0,1,2,1]);
    this.dancer.animations.play('idle',3,true)
}

function BmpRect(x, y){
    var bmd = game.add.bitmapData(128,128);
    bmd.ctx.beginPath()
    bmd.ctx.rect(0, 0, 30,8);
    bmd.ctx.fillStyle = "#aaa";
    bmd.ctx.fill();
    //return game.add.sprite(x, y, bmd);
    //return game.make.sprite(x, y, bmd); /* works with game.add.existing(this.bmpSprite) */
    return bmd;
}

function IndicatorGroup(x,y,distance,sprite){
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.sprite = sprite;
    this.indicators = game.add.group();

    this.create = function(){
        this.indicators.create(x,y,sprite);
    };

    this.move = function(duration){
        m1 = game.add.tween(this.indicators.getTop());
        m1.to({y:y+this.distance}, duration,Phaser.Easing.Linear.None);
        m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
        m1.start()
    }
}

function IndicatorManager(x,y){
    this.startingLine = new Phaser.Line(x,y,x+150,y);
    this.sLine = new Phaser.Line(x,y+75,x+150,y+75);
    this.eLine = new Phaser.Line(x,y+50,x+150,y+50);
    this.qLine = new Phaser.Line(x,y+100,x+150,y+100);

    this.bmpSprite = new BmpRect();

    this.qi = new IndicatorGroup(x+95,y-4, 100,this.bmpSprite);
    this.ei = new IndicatorGroup(x+55,y+46, 50,this.bmpSprite);
    this.si = new IndicatorGroup(x+15,y+71, 25,this.bmpSprite);
}