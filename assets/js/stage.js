function LevelStage(phaserStage){
    this.phaserStage = phaserStage;
    this.margin = 6;
    this.heightA = 134;
    this.heightB = 318;
    this.heightC = 124;
    this.colWidth = 50;

    /////////////Construct Windows//////////////////////
    //--Stage BG (changes color during beats)
    this.bgBmp = new BmpRect(0,0,this.phaserStage.width,this.phaserStage.height,"#ffffff");
    this.bgSprite = game.add.sprite(0,0,this.bgBmp);
    this.bgSprite.tint = 0xaa2222;

    //--Inner Windows(margins subtracted)
    this.winWidth = this.phaserStage.width-this.margin*2;
    this.winHeight = this.phaserStage.height-this.margin*2;

    this.winABmp = new BmpRect(0,0,this.winWidth *.3,this.heightA, "#ddd");
    this.windowA = game.add.sprite(this.margin,this.margin,this.winABmp);
    this.winBBmp = new BmpRect(0,0,this.winWidth *.7-this.margin,this.winHeight *.2, "#ddd");
    this.windowB = game.add.sprite(this.winWidth *.3+this.margin*2,this.margin,this.winBBmp);
    this.winCBmp = new BmpRect(0,0,this.winWidth,this.heightB, "#88c");
    this.windowC = game.add.sprite(this.margin,this.heightA+this.margin*2,this.winCBmp);
    this.winDBmp = new BmpRect(0,0,this.winWidth,this.heightC, "#ddd");
    this.windowD = game.add.sprite(this.margin,this.heightA+this.heightB+this.margin*3,this.winDBmp);
    this.cropGraphicsC = game.add.graphics();
    this.cropGraphicsD = game.add.graphics();
    this.cropGraphicsC.beginFill(0,0x000000);
    this.cropGraphicsD.beginFill(0,0x000000);
    this.cropRectC = this.cropGraphicsC.drawRect(this.margin,this.heightA+this.margin*2,this.winWidth, this.heightB);
    this.cropRectD = this.cropGraphicsD.drawRect(this.margin,this.heightA+this.heightB+this.margin*3,this.winWidth, this.heightC);
    this.p1 = new Phaser.Point(350,440);
    this.p2 = new Phaser.Point(300,445);
    this.p3 = new Phaser.Point(450,440);
    this.p4 = new Phaser.Point(275,430);

    /////////////Construct Stage Graphics//////////////////////

    this.grillSky = gradient_bg(0x0D51a8, 0xe7a36E);


    this.skyMini = gradient_bg(0x2D61a8, 0xe7a36E);
    this.grillBg = new ModSprite(0,this.windowA.position.y,this.grillSky,{scale:[1,.85],mask:this.cropRectC});

    this.grillBgMini = new ModSprite(0,this.windowD.position.y,this.skyMini,{scale:[1,.25],mask:this.cropRectD});
    this.grill = new ModSprite(-100,-100,"grill",{scale:[4.05,4.7],mask:this.cropRectC});

    this.grillMini = new AnimSprite(60,460,"grillMini",[0],utils.arrayRange(1,9),4,4.8,this.cropRectD);
    this.chef = new ModSprite(40,5, "chef", {scale:[3,3], static:0, drag:true});
}
