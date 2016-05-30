function InputConductor(stage,chef){
    this.stage = stage;
    this.chef = chef;
};

InputConductor.prototype = {
    createEnsemble: function(parent, x, y, color, distance, spriteFrame, control, beatObj,hm,musicObj,chef,sm,tm, type){
        return new InputEnsemble(parent, x, y, color, distance, spriteFrame, control, beatObj,hm,musicObj,chef,sm,tm, type)
    },
    checkRoles: function(){
        //if(this.chef.checkGrill() !== undefined){
        //    log("We ready now!");
        //}
    },
    removeEnsemble: function(){
        log("removing ensemble");
    }
};

function InputEnsemble(parent, x, y, color, distance, spriteFrame, input, beatObj,hm,musicObj,chef,sm,tm, type){
    this.ic = parent;
    switch(type){
        case("trick"):
            this.icon = new ModSprite(x,y+20, "iconTrick", {scale:[1.4,1.4]});
            break;
        default:
            this.icon = new ModSprite(x,y+20, "iconBaseFood", {scale:[1.5,1.5]});
    }
    this.x = x;
    this.y = y;
    this.indicator = new BmpRect(0,0,40, 8,color);
    this.sprite = new ModSprite(x+20, y, "buttons", {scale:[1,1], anchor:[0.5,0.5], alpha:0.5, static:spriteFrame, drag:true});
    this.si = new SlidingIndicator(x,y-distance-4, distance, this.indicator);
    this.graphics = game.add.graphics(x,y);
    this.graphics.lineStyle(2, Phaser.Color.hexToRGB(color));
    this.graphics.lineTo(40,0);
    this.input = input.onDown.add(function(){actionOne(this.ic, beatObj,hm,musicObj.theTime,chef,sm,tm, [this.x,this.y], type);}, this);
}

InputEnsemble.prototype = {
    beat: function(beatObjDuration,duration, alpha, scale){
        this.si.indicate(beatObjDuration);
        flash(this.sprite,duration,alpha,scale)
    }
};

