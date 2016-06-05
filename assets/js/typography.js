function TextManager(stage) {
    this.stage = stage;
    this.resultIndicator = new TextIndicator(this.stage);
}

function BmpText(font,text,size){
    this.bmpText = game.make.bitmapText(0, 0, font,text,size);
    this.spriteText = this.bmpText.generateTexture();
    return this.spriteText;
}

function TextIndicator(stage){
    this.stage = stage;
    this.indicators = game.add.group();
}

TextIndicator.prototype = {
    shoot: function(sprite, duration, distance, location){
        this.x = location[0];
        this.y = location[1];
        this.indicators.create(this.x, this.y, sprite);
        this.latestIndicator = this.indicators.getTop();
        this.latestIndicator.alpha = 1;
        this.m1 = game.add.tween(this.latestIndicator);
        this.m2 = game.add.tween(this.latestIndicator.scale);
        this.m1.to({x:this.x+distance,y:this.y-distance, alpha:0.5}, duration,Phaser.Easing.Exponential.In);
        this.m2.to({x:2,y:2}, duration,Phaser.Easing.Exponential.In);
        this.m1.onComplete.add(function(){this.indicators.remove(this.indicators.getBottom())},this);
        this.m1.start()
        this.m2.start()
    }
};

