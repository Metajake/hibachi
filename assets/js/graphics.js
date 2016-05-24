function LevelStage(stage){
    this.stage = stage;
    this.stage.backgroundColor = 0x9999dd;
    this.margin = 5;
}

LevelStage.prototype = {
    constructWindows: function(){
        this.bgBmp = new BmpRect(0,0,game.stage.width,game.stage.height,"#dcc");
        this.bgSprite = game.add.sprite(0,0,this.bgBmp);
        this.winWidth = game.stage.width-this.margin*2;
        this.winHeight = game.stage.height-this.margin*2;
        this.winABmp = new BmpRect(0,0,this.winWidth *.3,this.winHeight *.2, "#ddd");
        this.windowA = game.add.sprite(this.margin,this.margin,this.winABmp);
        this.winBBmp = new BmpRect(0,0,this.winWidth *.7-this.margin,this.winHeight *.2, "#ddd");
        this.windowB = game.add.sprite(this.winWidth *.3+this.margin*2,this.margin,this.winBBmp);
        this.winCBmp = new BmpRect(0,0,this.winWidth,this.winHeight *.6-this.margin*3, "#88c");
        this.windowC = game.add.sprite(this.margin,this.winHeight *.2+this.margin*2,this.winCBmp);
        this.winDBmp = new BmpRect(0,0,this.winWidth,this.winHeight *.2+this.margin, "#ddd");
        this.windowD = game.add.sprite(this.margin,this.winHeight*.8,this.winDBmp);
        this.cropGraphicsC = game.add.graphics();
        this.cropGraphicsD = game.add.graphics();
        this.cropGraphicsC.beginFill(0,0x000000);
        this.cropGraphicsD.beginFill(0,0x000000);
        this.cropRectC = this.cropGraphicsC.drawRect(this.margin,this.winHeight *.2+this.margin*2,this.winWidth, this.winHeight *.6-this.margin*3);
        this.cropRectD = this.cropGraphicsD.drawRect(this.margin,this.winHeight*.8,this.winWidth, this.winHeight *.2+this.margin);
        this.poi1 = [330,440]
    },
    constructElements: function(){
        this.grillSky = gradient_bg(0x0D51a8, 0xe7a36E);
        this.skyMini = gradient_bg(0x2D61a8, 0xe7a36E);
        this.grillBg = new ModSprite(0,this.windowA.position.y,this.grillSky,{scale:[1,.85],mask:this.cropRectC});
        this.grillBgMini = new ModSprite(0,this.windowD.position.y,this.skyMini,{scale:[1,.25],mask:this.cropRectD});
        this.grill = new ModSprite(-100,0,"grill",{scale:[4.05,4.05],mask:this.cropRectC});

        this.keyboard = new ModSprite(320, 395, "keyboard",{scale:[5,5],static:1});
        this.grillMini = new AnimSprite(60,455,"grillMini",[0],utils.arrayRange(1,9),4,4.8,this.stage.cropRectD);
    },
    flash : function(){
        t1 = game.add.tween(this.bgSprite);
    }
};

function tweenTint(sprite, startColor, endColor, duration) {
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
        this.sprite.anchor.setTo(hash.anchor[0],hash.anchor[1]);
    }
    return this.sprite;
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