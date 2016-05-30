function tweenTint(sprite, startColor, endColor, duration) {
    //~~~~~~~ EXAMPLE CALL: tweenTint(this.stage.bgSprite, 0xaa6666,0xee9999, this.bpm *.02)
    colorBlend = {step: 0};
    game.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default,false, 0,0,true)
        .onUpdateCallback(function() {
            sprite.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
        }).start();
}

function gradient_bg(startHex, endHex){
    var out = [];
    var sky = game.add.bitmapData(gameWidth, gameHeight);
    //sky.addToWorld();
    var skyY = 0;
    for (var i = 0; i < gameHeight; i++) {
        var c = Phaser.Color.interpolateColor(startHex, endHex, 330, i);
        sky.rect(0, skyY, 800, skyY+2, Phaser.Color.getWebRGB(c));
        out.push(Phaser.Color.getWebRGB(c));
        skyY += 2;
    }
    return sky;
}

function BmpRect(x,y, width, height, color){
    bmd = game.add.bitmapData(800,600);
    bmd.rect(x,y, width, height, color);
    return bmd;
}

function BmpCirc(x, y, size, color, toSprite){
    bmd = game.add.bitmapData(800,600);
    bmd.circle(x, y, size,color);
    if(toSprite !== "undefined"){
        sprite = bmd.generateTexture()
        return sprite
    }
    return bmd;
}

function ModSprite(x,y,key,hash){
    this.sprite = game.add.sprite(x,y,key);
    if(typeof(hash.scale) !== "undefined"){
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(hash.scale[0],hash.scale[1])
    }
    if(typeof(hash.mask) !== "undefined"){
        this.sprite.mask = hash.mask;
    }
    if(typeof(hash.static) !== "undefined"){
        staticAnim = this.sprite.animations.add("static");
        staticAnim.frame = hash.static;
    }
    if(typeof(hash.alpha) !== "undefined"){
        this.sprite.alpha = hash.alpha
    }
    if(typeof(hash.anchor) !== "undefined"){
        this.sprite.anchor.set(hash.anchor[0],hash.anchor[1]);
    }
    if(typeof(hash.drag) !== "undefined"){
        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
    }
    return this.sprite;
}

function flash(graphic, duration, alpha, scale){
    t1 = game.add.tween(graphic);
    t2 = game.add.tween(graphic.scale);
    t1.to({alpha:alpha},duration,Phaser.Easing.Linear.None,false, 0,0,true);
    t2.to({x:scale,y:scale},duration,Phaser.Easing.Linear.None,false, 0,0,true);
    t1.start();
    t2.start()
}

function AnimSprite(x,y,key, start, idle, speed, scale, cropRect){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(scale, scale);
    this.sprite.mask = cropRect;
    this.start = this.sprite.animations.add('start', start);
    this.idle = this.sprite.animations.add('idle', idle);
    this.start.play(speed,false);
    this.start.onComplete.add(function(){this.idle.play(speed,true);},this);
    return this
}

function IndicatorManager(stage){
    this.stage = stage;
    this.y = this.stage.p1.y; // MOVE THIS.Y PER MEASUREMENTMANAGERVERTICAL POSITION
    this.width = 150; // MEASUREMENTMANAGERVERTICAL WIDTH
    this.x2 = 600;
    this.indicatorHeight = 8;
    this.distance = 20;
    this.col = 20;

    //this.tf = new Flasher(this.stage.p1.x,this.stage.p1.y, BmpCirc(20,20,20,"#000"),[1,1]);
    //this.sf = new Flasher(this.stage.p1.x+this.col*5,this.stage.p1.y+this.col, BmpCirc(20,20,20,"#F0F"), [1,1]);
    //this.ef = new Flasher(this.stage.p1.x+this.col*2.5,this.stage.p1.y+15, BmpCirc(10,10,10,"#0FF"), [1,1]);
    //this.qf = new Flasher(this.stage.p1.x+this.col*4,this.stage.p1.y+35, BmpCirc(10,10,10,"#FF0"), [1,1]);

    //this.i32= new BmpRect(0,0,40,this.indicatorHeight, "#000");
    //this.i16= new BmpRect(0,0,40,this.indicatorHeight, "#f0f");
    //this.i8= new BmpRect(0,0,20,this.indicatorHeight, "#0ff");
    //this.i4= new BmpRect(0,0,20,this.indicatorHeight, "#ff0");
    //this.ts = new SlidingIndicator(this.stage.p1.x,this.y-this.distance-(this.indicatorHeight *.5), this.distance,this.i32);
    //this.ss = new SlidingIndicator(this.stage.p1.x+this.col*6,this.y-this.distance*2-(this.indicatorHeight *.5), this.distance*2,this.i16);
    //this.es = new SlidingIndicator(this.stage.p1.x+this.col*2.75,this.y-this.distance*3-(this.indicatorHeight *.5), this.distance*3,this.i8);
    //this.qs = new SlidingIndicator(this.stage.p1.x+this.col*4.5,this.y-this.distance*4-(this.indicatorHeight *.5), this.distance*4,this.i4);

    //this.leftStart= new Phaser.Line(this.stage.p1.x,this.y,this.stage.p1.x+this.width,this.y);
    //this.tLine = new Phaser.Line(this.stage.p1.x,this.y-this.distance,this.stage.p1.x+this.width,this.y-this.distance);
    //this.sLine = new Phaser.Line(this.stage.p1.x,this.y-this.distance*2,this.stage.p1.x+this.width,this.y-this.distance*2);
    //this.rightStart= new Phaser.Line(this.x2,this.y,this.x2+this.width,this.y);
    //this.t2Line = new Phaser.Line(this.x2,this.y-this.distance,this.x2+this.width,this.y-this.distance);
    //this.eLine = new Phaser.Line(this.group1X,this.y-this.distance*3,this.group1X+this.width,this.y-this.distance*3);
    //this.qLine = new Phaser.Line(this.group1X,this.y-this.distance*4,this.group1X+this.width,this.y-this.distance*4);

    //this.tef = new Flasher(x-100,y, 'chickenleg', 0x0000ff);
    //this.sef = new Flasher(x,y, 'chickenleg', 0x0000ff);
    //this.eef = new Flasher(x+100,y, 'chickenleg', 0xff0000);
    //this.qef = new Flasher(x+200, y, 'chickenleg', 0x00ff00);
}

function Flasher(x, y, displayObj, scale){
    this.sprite = new ModSprite(x,y,displayObj,{scale:scale,alpha:0})
}

Flasher.prototype = {
    flash: function(duration){
        f1 = game.add.tween(this.sprite);
        //f2 = game.add.tween(this.sprite.scale);
        f1.to({alpha:1},duration,Phaser.Easing.Linear.None,false, 0,0,true);
        //f2.to({x:1.1,y:1.1},duration,Phaser.Easing.Linear.None,false, 0,0,true);
        f1.start();
        //f2.start();
    }
};

function SlidingIndicator(x,y,distance,sprite){
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.sprite = sprite
    this.indicators = game.add.group();
}

SlidingIndicator.prototype.indicate = function(duration){
    this.indicators.create(this.x,this.y,this.sprite);
    this.latestIndicator = this.indicators.getTop();
    this.latestIndicator.alpha = 0;
    this.m1 = game.add.tween(this.latestIndicator);
    this.m1.to({y:this.y+this.distance, alpha:1}, duration,Phaser.Easing.Linear.None);
    this.m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
    this.m1.start()
};