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