function sky_bg(){
	var out = [];
    var sky = game.add.bitmapData(800, 600);
    sky.addToWorld();
    var skyY = 0;
    for (var i = 0; i < 600; i++) {
        var c = Phaser.Color.interpolateColor(0x0D51a8, 0xe7a36E, 330, i);
        sky.rect(0, skyY, 800, skyY+2, Phaser.Color.getWebRGB(c));
        out.push(Phaser.Color.getWebRGB(c));
        skyY += 2;
    }
}

function make_flash(toFlash){
	f1 = game.add.tween(toFlash)
	f1.to({alpha:1},music.bpm/2,Phaser.Easing.Linear.None);
	f1.onComplete.add(function(){toFlash.alpha=0;});
	return f1;
}