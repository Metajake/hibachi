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
        f1.to({alpha:1},duration,Phaser.Easing.Linear.None);
        f1.onComplete.add(function(){this.sprite.alpha=0.1;}, this);
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