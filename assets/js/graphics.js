var layout = {
    margin : 5
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

function GraphicsRect(x,y,width,height,color,alpha, ls){
    this.graphics = game.add.graphics(0,0);
    this.graphics.beginFill(color,alpha);
    if(ls){this.graphics.lineStyle(ls[0], ls[1], ls[2])};
    this.graphics.drawRect(x,y,width,height);
    //return this.graphics
}

function BmpRect(x,y, width, height, color){
    bmd = game.add.bitmapData(800,600);
    bmd.rect(x,y, width, height, color)
    //bmd.ctx.rect(x,y, width, height);
    //bmd.ctx.fillStyle = color;
    //bmd.ctx.fill();
    return bmd;
}

function BmpCirc(x, y, size, color){
    circ = game.add.bitmapData(x+128,y+128);
    circ.circle(x, y, size,color);
    return circ;
}

function LevelStage(stage){
    this.stage = stage;
    this.stage.backgroundColor = 0xfe3333;
}

LevelStage.prototype.constructWindows = function(){
    this.winWidth = game.stage.width-layout.margin*2;
    this.winHeight = game.stage.height-layout.margin*2;
    this.winABmp = new BmpRect(0,0,this.winWidth *.3,this.winHeight *.2, "#ddd");
    this.windowA = game.add.sprite(layout.margin,layout.margin,this.winABmp);
    this.winBBmp = new BmpRect(0,0,this.winWidth *.7-layout.margin,this.winHeight *.2, "#ddd");
    this.windowB = game.add.sprite(this.winWidth *.3+layout.margin*2,layout.margin,this.winBBmp);
    this.winCBmp = new BmpRect(0,0,this.winWidth,this.winHeight *.6-layout.margin*3, "#88c");
    this.windowC = game.add.sprite(layout.margin,this.winHeight *.2+layout.margin*2,this.winCBmp);
    this.winDBmp = new BmpRect(0,0,this.winWidth,this.winHeight *.2+layout.margin, "#ddd");
    this.windowD = game.add.sprite(layout.margin,this.winHeight*.8,this.winDBmp);
}

LevelStage.prototype.update = function(){
    //for 16th note background graphics hype
}

function CroppedSprite(x,y,key,scale,cropRect){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(scale[0], scale[1]);
    this.boundingBox = game.add.graphics();
    this.boundingBox.beginFill(0x000000);
    this.boundingBox.drawRect(layout.margin,cropRect.winHeight *.2+layout.margin*2,cropRect.winWidth,cropRect.winHeight *.6 - layout.margin*3)
    this.sprite.mask = this.boundingBox;
    return this.sprite;
}

function FoodSprite(x,y,key, speed, scale, cropRect){
    this.sprite = game.add.sprite(x,y,key);
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(scale, scale);
    this.boundingBox = game.add.graphics();
    this.boundingBox.beginFill(0x000000);
    this.boundingBox.drawRect(layout.margin,cropRect.winHeight *.2+layout.margin*2,cropRect.winWidth,cropRect.winHeight *.6 - layout.margin*3)
    this.sprite.mask = this.boundingBox;
    this.sprite.animations.add('start');
    this.sprite.animations.add('idle');
    this.sprite.animations.play('start',speed);
    return this.sprite
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
    m1 = game.add.tween(this.indicators.getTop());
    m1.to({y:this.y+this.distance}, duration,Phaser.Easing.Linear.None);
    m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
    m1.start()
}

function Flasher(x, y, displayObj, tint){
    this.sprite = game.add.sprite(x,y,displayObj);
    if(tint){this.sprite.tint = tint;}else{}
    this.sprite.smoothed = false;
    this.sprite.scale.setTo(2,2);
    this.sprite.alpha = 0.0; //CHANGE BACK TO 0.1 to see INDICATOR Before Flashing
}

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

function IndicatorManager(){}

IndicatorManager.prototype.constructFlashers = function(x, y, size){
    this.c1 = BmpCirc(size, size, size,"#000");
    this.c2 = BmpCirc(size, size, size,"#00f");
    this.c3 = BmpCirc(size, size, size,"#ff0");
    this.c4 = BmpCirc(size, size, size,"#f0f");
    this.sf = new Flasher(x,y, this.c1);
    this.ef = new Flasher(x+50,y, this.c2);
    this.qf = new Flasher(x+100,y, this.c3);
    this.tf = new Flasher(x-50,y, this.c4);
};

IndicatorManager.prototype.constructSliders = function(x,y){
    this.rectSprite = new BmpRect(0,0,30,8, "#aaa");
    this.startingLine = new Phaser.Line(x,y,x+150,y);
    this.tLine = new Phaser.Line(x-50,y+87.5,x+150,y+87.5);
    this.sLine = new Phaser.Line(x-50,y+75,x+150,y+75);
    this.eLine = new Phaser.Line(x-50,y+50,x+150,y+50);
    this.qLine = new Phaser.Line(x-50,y+100,x+150,y+100);


    // THESE SHOULD BE MORE PRECISE AND CALCULATED.
    this.qs = new SlidingIndicator(x+95,y-4, 100,this.rectSprite);
    this.es = new SlidingIndicator(x+55,y+46, 50,this.rectSprite);
    this.ss = new SlidingIndicator(x+15,y+71, 25,this.rectSprite);
    this.ts = new SlidingIndicator(x-35,y+82, 12.5,this.rectSprite);
};

IndicatorManager.prototype.constructExpectingFlashers = function(x, y){
    this.tef = new Flasher(x-100,y, 'chickenleg', 0x0000ff);
    this.sef = new Flasher(x,y, 'chickenleg', 0x0000ff);
    this.eef = new Flasher(x+100,y, 'chickenleg', 0xff0000);
    this.qef = new Flasher(x+200, y, 'chickenleg', 0x00ff00);
};

function MeasurementManager(currentTrack, cropRect){
    this.currentTrack = currentTrack
    this.measureDuration = this.currentTrack.bpm * 4;
    this.bottom = 455;
    this.top = 380;
    this.p1 = 100;
    this.p2 = 300;
    this.p3 = 500;
    this.p4 = 700;
    this.measureWidth = 225;
    this.measureHeight = 75;
    this.bar1bmd = game.add.bitmapData(800,600);
    this.bar1bmd.addToWorld();
    this.bar1 = this.bar1bmd.line(5,this.bottom,795,this.bottom,'#999',3);
    this.markers = game.add.graphics(0,0);
    this.markers.lineStyle(2,0xeeeeee,1);
    this.markers.moveTo(this.p1,this.top);
    this.markers.lineTo(this.p1,this.bottom);
    this.markers.moveTo(this.p2,this.top);
    this.markers.lineTo(this.p2,this.bottom);
    this.markers.moveTo(this.p3,this.top);
    this.markers.lineTo(this.p3,this.bottom);
    this.markers.moveTo(this.p4,this.top);
    this.markers.lineTo(this.p4,this.bottom);
    this.currentCustomMeasure = 0;
}

MeasurementManager.prototype.update = function(){

};

MeasurementManager.prototype.addMeasure = function(type){
    this.newMeasure = new Measure(this,this.p3,this.bottom-75,this.measureWidth,this.measureHeight, this.measureDuration*3, type);
};

function Measure(manager,x, y,w,h, td, type){
    this.quarter = 0;
    this.eighth = 0;
    this.sixteenth = 0;
    this.graphics = game.add.graphics(x,y);
    this.graphics.beginFill(0x111111, .1);
    //this.graphics.lineStyle(0, 0xffffff, 1);
    this.graphics.drawRect(x,y, w, h);
    if(type == 1) {
        this.graphics.lineStyle(2, 0xffffff,.7);
        for(i = 0;i<4;i++){
            this.graphics.moveTo(x+50*this.quarter,y+50);
            this.graphics.lineTo(x+50*this.quarter,y+h);
            this.quarter ++;
        }
        this.graphics.lineStyle(2, 0xaaaaaa,.7);
        for(i = 0;i<8;i++){
            this.graphics.moveTo(x+25*this.eighth,y+25);
            this.graphics.lineTo(x+25*this.eighth,y+50);
            this.eighth ++;
        }
        this.graphics.lineStyle(2, 0x333333,.7);
        for(i = 0;i<16;i++){
            this.graphics.moveTo(x+12.5*this.sixteenth,y);
            this.graphics.lineTo(x+12.5*this.sixteenth,y+25);
            this.sixteenth ++;
        }
    } else if (type == 2){
        customMeasure = manager.currentTrack.customMeasures[manager.currentCustomMeasure];
        this.graphics.lineStyle(2, 0xff9999, 1);
        for(q in customMeasure["q"]){
            if(customMeasure["q"][q] == 1){
                this.graphics.moveTo(x+50*this.quarter,y);
                this.graphics.lineTo(x+50*this.quarter,y+h);
            }
            this.quarter ++;
        }
        this.graphics.lineStyle(2, 0x99ff99, 1);
        for(e in customMeasure["e"]){
            if(customMeasure["e"][e] == 1){
                this.graphics.moveTo(x+25*this.eighth,y+25);
                this.graphics.lineTo(x+25*this.eighth,y+50);
            }
            this.eighth ++;
        }
        this.graphics.lineStyle(2, 0x33ffff, 1);
        for(s in customMeasure["s"]){
            if(customMeasure["s"][s] == 1){
                this.graphics.moveTo(x+12.5*this.sixteenth,y);
                this.graphics.lineTo(x+12.5*this.sixteenth,y+25);
            }
            this.sixteenth ++;
        }
        manager.currentCustomMeasure ++;
    } else if (type == 3){
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x111111, .1);
        this.graphics.lineStyle(2, 0x00ff00, 1);
        this.graphics.drawRect(x,y, w, h);
    }

    this.travelDuration = td;
    this.sprite = game.add.sprite(x,y,this.graphics.generateTexture());
    this.graphics.destroy();
    this.tween = game.add.tween(this.sprite);
    this.tween.to({ x: -200 }, this.travelDuration, 'Linear', true, 0);
    this.tween.onComplete.add(function(){this.sprite.destroy()}, this);
    this.tween.start();
}

Measure.prototype.update = function(){

}