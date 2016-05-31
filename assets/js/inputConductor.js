function InputConductor(stage,chef, hm, mu, sm, tm){
    this.hm = hm;
    this.stage = stage;
    this.chef = chef;
    this.mu = mu;
    this.sm = sm;
    this.tm = tm;
    this.inputs = {
        one:new InputEnsemble2("iconTrick", this.stage.p1.x, this.stage.p1.y, "#0ff", 1, 80, controls.W, this, this.mu.beat4, this.tm),
        two:{},
        three:{},
        four:{},
        five:{},
        six:{},
        seven:{},
        eight:{},
        nine:{},
        ten:{}
    };
};

InputConductor.prototype = {
    action: function(goal, qualityNumbers, qualityNames, location, type){
        this.qualityResult = compareTiming(this.mu.theTime, goal, qualityNumbers, qualityNames);
        this.choice = this.sm.getRand(this.sm.utinsels);
        this.tm.resultIndicator.shoot(this.qualityResult.sprite, 600, 100, location);
        this.choice.sound.play()

        this.chef.grill.logResult(this.qualityResult.string);
        if(this.chef.grill.log.perfect.length >= 4 && this.inputs.two.beatObj == undefined){
            this.updateEnsemble("one", "iconTrick", this.stage.p1.x, this.stage.p1.y, "#0ff", 1, 40, controls.W, this.mu.beat16)
            //this.inputs.one = new InputEnsemble2("iconTrick", this.stage.p1.x, this.stage.p1.y, "#0ff", 1, 40, controls.W, this, this.mu.beat8, this.tm);
            this.inputs.two = new InputEnsemble2("iconBaseFood", this.stage.p3.x, this.stage.p3.y, "#f0f", 0, 80, controls.UP, this, this.mu.beat4, this.tm);
        }
        if(type == "iconBaseFood" && this.chef.grill.currentFood.length <= 6) {
            this.chef.addFood("noodles", 8, 4, 2, ["shortcake"]);
        }

        this.hungerCountPos = this.hm.checkHungriest();
        if(this.qualityResult.score > 1){
            if(this.hm.hungerCount[this.hungerCountPos] !== undefined){
                this.hm.hungerCount[this.hungerCountPos].feed(15, this.qualityResult.score);
            }
            this.chef.grill.rep += this.qualityResult.score;
        } else{this.chef.grill.rep -= 1;}


    },
    beat: function(type){
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == type){
                this.inputs[input].beat(this.inputs[input].beatObj.duration, this.mu.trackInfo.bpm *.02, 1, 2)
            }
        }
    },
    updateEnsemble: function(input, type, x, y, color, staticFrame, distance, control, beatObj){
        this.inputs[input].input._destroy();
        this.inputs[input].icon.destroy();
        this.inputs[input].sprite.destroy();
        this.inputs[input].si.indicators.destroy();
        this.inputs[input].graphics.destroy();
        this.inputs[input] = new InputEnsemble2(type, x, y, color, staticFrame, distance, control, this, beatObj, this.tm)
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

function InputEnsemble2(type, x, y, color, staticFrame, distance, input, parent, beat, tm){
    this.x = x;
    this.y = y;
    this.type = type;
    this.icon = new ModSprite(x,y+20, this.type, {scale:[1.4,1.4]});
    this.indicator = new BmpRect(0,0,40, 8,color);
    this.sprite = new ModSprite(x+20, y, "buttons", {scale:[1,1], anchor:[0.5,0.5], alpha:0.5, static:staticFrame, drag:true});
    this.si = new SlidingIndicator(x,y-distance-4, distance, this.indicator);
    this.graphics = game.add.graphics(x,y);
    this.graphics.lineStyle(2, Phaser.Color.hexToRGB(color));
    this.graphics.lineTo(40,0);
    this.beatObj = beat;
    this.input = input.onDown.add(function(){
        parent.action(this.beatObj.hitGoal, this.beatObj.qualityNumbers, this.beatObj.qualityNames, [this.x, this.y], this.type);
    }, this);
    game.world.bringToTop(tm.resultIndicator.indicators);
}

InputEnsemble2.prototype = {
    beat: function(beatObjDuration, duration, alpha, scale){
        this.si.indicate(beatObjDuration);
        flash(this.sprite, duration, alpha, scale)
    }
};

