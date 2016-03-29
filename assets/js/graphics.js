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

function Indicator(){
    this.sprite = game.add.sprite(125,0,'chickenleg');
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(10,10)
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

function IndicatorObj(){
    this.indicators = game.add.group();
    this.create = function(){
        this.bmpSprite = new BmpRect(200,200);
        this.indicators.create(665,96, this.bmpSprite);
    };
    this.move = function(duration){
        toMove = this.indicators.getTop();
        toRemove = this.indicators.getBottom();
        m1 = game.add.tween(toMove);
        m1.to({y:196}, duration,Phaser.Easing.Linear.None);
        m1.onComplete.add(function(){this.indicators.remove(toRemove)},this);
        m1.start()
    }
}