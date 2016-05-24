function IndicatorManager(stage){
    this.stage = stage;
}

IndicatorManager.prototype.constructIndicators= function(){
    this.y = 430; // MOVE THIS.Y PER MEASUREMENTMANAGERVERTICAL POSITION
    this.width = 150; // MEASUREMENTMANAGERVERTICAL WIDTH
    this.x2 = 600;
    this.indicatorHeight = 8;
    this.distance = 20;
    this.col = 20;

    this.tf = new Flasher(this.stage.poi1[0],this.stage.poi1[1], BmpCirc(20,20,20,"#000"),[1,1]);
    this.sf = new Flasher(this.stage.poi1[0]+this.col*5,this.stage.poi1[1]+this.col, BmpCirc(20,20,20,"#F0F"), [1,1]);
    this.ef = new Flasher(this.stage.poi1[0]+this.col*2.5,this.stage.poi1[1]+15, BmpCirc(10,10,10,"#0FF"), [1,1]);
    this.qf = new Flasher(this.stage.poi1[0]+this.col*4,this.stage.poi1[1]+35, BmpCirc(10,10,10,"#FF0"), [1,1]);

    this.i32= new BmpRect(0,0,40,this.indicatorHeight, "#000");
    this.i16= new BmpRect(0,0,40,this.indicatorHeight, "#f0f");
    this.i8= new BmpRect(0,0,20,this.indicatorHeight, "#0ff");
    this.i4= new BmpRect(0,0,20,this.indicatorHeight, "#ff0");
    this.ts = new SlidingIndicator(this.stage.poi1[0],this.y-this.distance-(this.indicatorHeight *.5), this.distance,this.i32);
    this.ss = new SlidingIndicator(this.stage.poi1[0]+this.col*6,this.y-this.distance*2-(this.indicatorHeight *.5), this.distance*2,this.i16);
    this.es = new SlidingIndicator(this.stage.poi1[0]+this.col*2.75,this.y-this.distance*3-(this.indicatorHeight *.5), this.distance*3,this.i8);
    this.qs = new SlidingIndicator(this.stage.poi1[0]+this.col*4.5,this.y-this.distance*4-(this.indicatorHeight *.5), this.distance*4,this.i4);

    this.leftStart= new Phaser.Line(this.stage.poi1[0],this.y,this.stage.poi1[0]+this.width,this.y);
    this.tLine = new Phaser.Line(this.stage.poi1[0],this.y-this.distance,this.stage.poi1[0]+this.width,this.y-this.distance);
    this.sLine = new Phaser.Line(this.stage.poi1[0],this.y-this.distance*2,this.stage.poi1[0]+this.width,this.y-this.distance*2);
    //this.rightStart= new Phaser.Line(this.x2,this.y,this.x2+this.width,this.y);
    //this.t2Line = new Phaser.Line(this.x2,this.y-this.distance,this.x2+this.width,this.y-this.distance);
    //this.eLine = new Phaser.Line(this.group1X,this.y-this.distance*3,this.group1X+this.width,this.y-this.distance*3);
    //this.qLine = new Phaser.Line(this.group1X,this.y-this.distance*4,this.group1X+this.width,this.y-this.distance*4);

    //this.tef = new Flasher(x-100,y, 'chickenleg', 0x0000ff);
    //this.sef = new Flasher(x,y, 'chickenleg', 0x0000ff);
    //this.eef = new Flasher(x+100,y, 'chickenleg', 0xff0000);
    //this.qef = new Flasher(x+200, y, 'chickenleg', 0x00ff00);
};

function Flasher(x, y, displayObj, scale){
    this.sprite = new ModSprite(x,y,displayObj,{scale:scale,alpha:0})
    this.amount = 1;
}

Flasher.prototype = {
    flash: function(duration){
        f1 = game.add.tween(this.sprite);
        //f2 = game.add.tween(this.sprite.scale);
        f1.to({alpha:this.amount},duration,Phaser.Easing.Linear.None,false, 0,0,true);
        //f2.to({x:1.1,y:1.1},duration,Phaser.Easing.Linear.None,false, 0,0,true);
        f1.start();
        //f2.start();
    }
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
};