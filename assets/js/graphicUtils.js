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
    //!--This one first
    if(typeof(hash.make) !== 'undefined'){
        this.sprite = game.make.sprite(x,y,key);
    }else{
        this.sprite = game.add.sprite(x,y,key);
    }
    if(typeof(hash.rotation) !== 'undefined'){
        this.sprite.rotation = hash.rotation*(Math.PI/180);
    }
    if(typeof(hash.scale) !== "undefined"){
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(hash.scale[0],hash.scale[1])
    }
    if(typeof(hash.mask) !== "undefined"){
        this.sprite.mask = hash.mask;
    }
    if(typeof(hash.static) !== "undefined"){
        this.staticAnim = this.sprite.animations.add("static");
        this.staticAnim.frame = hash.static;
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
    this.sprite.anchor.setTo(0.5)
    this.sprite.mask = cropRect;
    this.start = this.sprite.animations.add('start', start);
    this.idle = this.sprite.animations.add('idle', idle);
    this.start.onComplete.add(function(){this.idle.play(speed,true);},this);
    this.start.play(speed,false);
    return this
}

function SingleAnim(x,y,key,speed,scale,cropRect){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(scale,scale);
    this.sprite.anchor.setTo(0.5);
    this.sprite.mask = cropRect;
    this.play = this.sprite.animations.add('play');
    this.play.onComplete.add(function(){this.sprite.destroy();}, this);
    this.play.play(speed,false);
}

function SlidingIndicator(x,y,distance,sprite){
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.sprite = sprite;
    this.indicators = game.add.group();
}

SlidingIndicator.prototype.indicate = function(duration){
    this.indicators.create(this.x,this.y,this.sprite);
    this.latestIndicator = this.indicators.getTop();
    this.latestIndicator.alpha = 0;
    this.m1 = game.add.tween(this.latestIndicator);
    this.m1.to({y:this.y+this.distance, alpha:1}, duration,Phaser.Easing.Linear.None);
    this.m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
    this.m2 = game.add.tween(this.latestIndicator);
    this.m2.to({alpha:1}, duration *.75,Phaser.Easing.Linear.None);
    this.m3 = game.add.tween(this.latestIndicator);
    this.m3.to({alpha:0}, duration *.25,Phaser.Easing.Linear.None);
    this.m2.chain(this.m3);
    this.m1.start();
    this.m2.start()
};