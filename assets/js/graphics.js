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
    circ = game.add.bitmapData(x+size,y+size);
    circ.circle(x, y, size,color);
    if(toSprite !== "undefined"){
        sprite = circ.generateTexture()
        return sprite
    }
    return circ;
}

function LevelStage(stage){
    this.stage = stage;
    this.stage.backgroundColor = 0xfe3333;
    this.margin = 5;
}

LevelStage.prototype.constructWindows = function(){
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
};

LevelStage.prototype.constructElements = function(){
    this.grillSky = gradient_bg(0x0D51a8, 0xe7a36E);
    this.grillBg = new ModSprite(0,this.windowA.position.y,this.grillSky,{scale:[1,.85],mask:this.cropRectC});
    this.grill = new ModSprite(-100,0,"grill",{scale:[4.05,4.05],mask:this.cropRectC});
    //this.grill = game.add.sprite(-100,0,"grill");
    //this.grill.scale.setTo(4.05,4.05);
    //this.grill.mask = this.

    this.keyboard = new ModSprite(320, 395, "keyboard",{scale:[5,5],static:1});
    //this.grillMini = new ModSprite(80,455,"grillMini",{mask:this.stage.cropRectD,scale:[4.8,4.8]})
    this.grillMini = new AnimSprite(80,455,"grillMini",[0],utils.arrayRange(1,9),4,4.8,this.stage.cropRectD);
};

LevelStage.prototype.update = function(){
    //for 16th note background graphics hype
};

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

function Flasher(x, y, displayObj, tint){
    this.sprite = new ModSprite(x,y,displayObj,{tint:tint,scale:[2,2],alpha:0})
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

IndicatorManager.prototype.constructIndicators= function(x, y){
    this.y = y+300; // MOVE THIS.Y PER MEASUREMENTMANAGERVERTICAL POSITION
    this.width = 130; // MEASUREMENTMANAGERVERTICAL WIDTH
    this.x2 = x + 600;
    this.indicatorHeight = 8;
    this.distance = 20;
    this.flashSize = 9;
    this.columnWidth = 15;
    this.group1X = game.world.centerX-this.columnWidth*4.5;

    this.tf = new Flasher(this.group1X,this.y+10, BmpCirc(this.flashSize,this.flashSize,this.flashSize,"#000"));
    this.sf = new Flasher(this.group1X+this.columnWidth*7.25,this.y+30, BmpCirc(this.flashSize,this.flashSize,this.flashSize,"#F0F"));
    this.ef = new Flasher(this.group1X+this.columnWidth*3,this.y+20, BmpCirc(this.flashSize/2,this.flashSize/2,this.flashSize/2,"#0FF"));
    this.qf = new Flasher(this.group1X+this.columnWidth*5.5,this.y+40, BmpCirc(this.flashSize/2,this.flashSize/2,this.flashSize/2,"#FF0"));

    this.i32= new BmpRect(0,0,40,this.indicatorHeight, "#000");
    this.i16= new BmpRect(0,0,40,this.indicatorHeight, "#f0f");
    this.i8= new BmpRect(0,0,20,this.indicatorHeight, "#0ff");
    this.i4= new BmpRect(0,0,20,this.indicatorHeight, "#ff0");
    this.ts = new SlidingIndicator(this.group1X,this.y-this.distance-(this.indicatorHeight *.5), this.distance,this.i32);
    this.ss = new SlidingIndicator(this.group1X+this.columnWidth*7,this.y-this.distance*2-(this.indicatorHeight *.5), this.distance*2,this.i16);
    this.es = new SlidingIndicator(this.group1X+this.columnWidth*3.5,this.y-this.distance*3-(this.indicatorHeight *.5), this.distance*3,this.i8);
    this.qs = new SlidingIndicator(this.group1X+this.columnWidth*5.25,this.y-this.distance*4-(this.indicatorHeight *.5), this.distance*4,this.i4);

    this.leftStart= new Phaser.Line(this.group1X,this.y,this.group1X+this.width,this.y);
    //this.rightStart= new Phaser.Line(this.x2,this.y,this.x2+this.width,this.y);
    this.tLine = new Phaser.Line(this.group1X,this.y-this.distance,this.group1X+this.width,this.y-this.distance);
    //this.t2Line = new Phaser.Line(this.x2,this.y-this.distance,this.x2+this.width,this.y-this.distance);
    this.sLine = new Phaser.Line(this.group1X,this.y-this.distance*2,this.group1X+this.width,this.y-this.distance*2);
    //this.eLine = new Phaser.Line(this.group1X,this.y-this.distance*3,this.group1X+this.width,this.y-this.distance*3);
    //this.qLine = new Phaser.Line(this.group1X,this.y-this.distance*4,this.group1X+this.width,this.y-this.distance*4);

    //this.tef = new Flasher(x-100,y, 'chickenleg', 0x0000ff);
    //this.sef = new Flasher(x,y, 'chickenleg', 0x0000ff);
    //this.eef = new Flasher(x+100,y, 'chickenleg', 0xff0000);
    //this.qef = new Flasher(x+200, y, 'chickenleg', 0x00ff00);
};

function SlidingIndicator(x,y,distance,sprite, tint){
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.sprite = sprite;
    this.tint = tint;
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
}

//MOVE MEASURE MANAGER INTO INDICATOR MANAGER -- UNIFY IT!
function MeasurementManagerVertical(trackInfo, cropRect, x, y){
    this.trackInfo = trackInfo
    this.cropRect = cropRect;
    this.measureDuration = this.trackInfo.bpm * 4;
    this.left = x;
    this.top = y;
    this.p1 = y+150;
    this.p2 = y+300;
    this.p3 = y+450;
    this.measureWidth = 130;
    this.measureHeight = 150*2;
    this.bar1bmd = game.add.bitmapData(800,600);
    this.bar1bmd.addToWorld();
    this.bar1 = this.bar1bmd.line(this.left,this.top,this.left,this.p3,'#999',3);
    this.markers = game.add.graphics(0,0);
    this.markers.lineStyle(2,0xeeeeee,1);
    this.markers.moveTo(this.left,this.top);
    this.markers.lineTo(this.left+this.measureWidth,this.top);
    this.markers.moveTo(this.left,this.p1);
    this.markers.lineTo(this.left+this.measureWidth,this.p1);
    this.markers.moveTo(this.left,this.p2);
    this.markers.lineTo(this.left+this.measureWidth,this.p2);
    this.markers.moveTo(this.left,this.p3);
    this.markers.lineTo(this.left+this.measureWidth,this.p3);
    this.currentCustomMeasure = 0;
}

MeasurementManagerVertical.prototype.update = function(){

};

MeasurementManagerVertical.prototype.addMeasure = function(duration, type){
    this.newMeasure = new MeasureVert(this, this.left, this.top, this.measureWidth, this.measureHeight, this.p3+this.measureHeight, duration, type,this.cropRect);
};

function MeasureVert(manager, x, y, w, h, dest, td, type, cropRect){
    this.quarter = 0;
    this.eighth = 0;
    this.sixteenth = 0;
    this.graphics = game.add.graphics(x,y);
    this.graphics.beginFill(0x111111, .1);
    //this.graphics.lineStyle(1, 0xffffff, 1);
    this.graphics.drawRect(x,y, w, h);
    if(type == 1) {
        this.graphics.lineStyle(2, 0x333333,.7);
        for(i = 0;i<16;i++){
            this.graphics.moveTo(x,y+(h *.0625)*this.sixteenth);
            this.graphics.lineTo(x+w,y+(h *.0625)*this.sixteenth);
            this.sixteenth ++;
        }
        this.graphics.lineStyle(1, 0xaaaaaa,.7);
        for(i = 0;i<8;i++){
            this.graphics.moveTo(x,y+(h *.125)*this.eighth);
            this.graphics.lineTo(x+w,y+(h *.125)*this.eighth);
            this.eighth ++;
        }
        this.graphics.lineStyle(1, 0xffffff,.7);
        for(i = 0;i<4;i++){
            this.graphics.moveTo(x,y+(h *.25)*this.quarter);
            this.graphics.lineTo(x+w,y+(h *.25)*this.quarter);
            this.quarter ++;
        }
    }// else if (type == 2){
    //    customMeasure = manager.currentTrack.customMeasures[manager.currentCustomMeasure];
    //    this.graphics.lineStyle(2, 0xff9999, 1);
    //    for(q in customMeasure["q"]){
    //        if(customMeasure["q"][q] == 1){
    //            this.graphics.moveTo(x+50*this.quarter,y);
    //            this.graphics.lineTo(x+50*this.quarter,y+h);
    //        }
    //        this.quarter ++;
    //    }
    //    this.graphics.lineStyle(2, 0x99ff99, 1);
    //    for(e in customMeasure["e"]){
    //        if(customMeasure["e"][e] == 1){
    //            this.graphics.moveTo(x+25*this.eighth,y+25);
    //            this.graphics.lineTo(x+25*this.eighth,y+50);
    //        }
    //        this.eighth ++;
    //    }
    //    this.graphics.lineStyle(2, 0x33ffff, 1);
    //    for(s in customMeasure["s"]){
    //        if(customMeasure["s"][s] == 1){
    //            this.graphics.moveTo(x+12.5*this.sixteenth,y);
    //            this.graphics.lineTo(x+12.5*this.sixteenth,y+25);
    //        }
    //        this.sixteenth ++;
    //    }
    //    manager.currentCustomMeasure ++;
    //} else if (type == 3){
    //    this.graphics = game.add.graphics(0, 0);
    //    this.graphics.beginFill(0x111111, .1);
    //    this.graphics.lineStyle(2, 0x00ff00, 1);
    //    this.graphics.drawRect(x,y, w, h);
    //}

    this.sprite = game.add.sprite(x,y,this.graphics.generateTexture());
    this.graphics.destroy();
    this.sprite.anchor.y = 0;
    this.boundingBox = game.add.graphics();
    this.boundingBox.beginFill(0x000000);
    this.boundingBox.drawRect(cropRect.margin,cropRect.winHeight *.2+cropRect.margin*2,cropRect.winWidth,cropRect.winHeight *.6 - cropRect.margin*3)
    this.sprite.mask = this.boundingBox;
    this.tween = game.add.tween(this.sprite);
    this.tween.to({ y: dest}, td, 'Linear', true, 0);
    this.tween.onComplete.add(function(){this.sprite.destroy()}, this);
    this.tween.start();
}

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
    this.boundingBox =
    this.tween = game.add.tween(this.sprite);
    this.tween.to({ x: -200 }, this.travelDuration, 'Linear', true, 0);
    this.tween.onComplete.add(function(){this.sprite.destroy()}, this);
    this.tween.start();
}

Measure.prototype.update = function(){

}

function MeasurementManagerHorizontal(trackInfo, cropRect){
    this.trackInfo = trackInfo
    this.measureDuration = this.trackInfo.bpm * 4;
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

MeasurementManagerHorizontal.prototype.update = function(){

};

MeasurementManagerHorizontal.prototype.addMeasure = function(type){
    this.newMeasure = new Measure(this,this.p3,this.bottom-75,this.measureWidth,this.measureHeight, this.measureDuration*3, type);
};