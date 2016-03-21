function make_sky_bg(){
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