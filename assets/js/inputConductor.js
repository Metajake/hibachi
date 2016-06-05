function InputConductor(stage,chef, hm, mu, sm, tm){
    this.hm = hm;
    this.stage = stage;
    this.chef = chef;
    this.mu = mu;
    this.sm = sm;
    this.tm = tm;
    this.inputs = {
        one:new InputEnsemble("iconTrick", this.stage.colWidth*7, this.stage.p1.y, 80, controls.W, this, this.mu.beat4, this.tm),
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
        //--Get Quality of Input Timing
        this.qualityResult = compareTiming(this.mu.theTime, goal, qualityNumbers, qualityNames);

        //--Select and Play random Sound effect
        this.choice = this.sm.getRand(this.sm.utinsels);
        this.choice.sound.play();

        //--Display Input Timing Quality
        this.tm.resultIndicator.shoot(this.qualityResult.sprite, 600, 100, location);

        //--Update Inputs according to quality
        if(this.chef.grill.averageTiming >= 4 && this.inputs.two.beatObj == undefined){ // check for two.beatObj==undefined because otherwise it was throwing errors creating the second input (or something like that)
            this.updateEnsemble("one", "iconTrick", this.stage.colWidth*7, this.stage.p1.y, 40, controls.W, this.mu.beat16)
            this.inputs.two = new InputEnsemble("iconBaseFood", this.stage.colWidth*8.5, this.stage.p3.y, 80, controls.UP, this, this.mu.beat4, this.tm);
        }

        //--Add food if grill is not full
        if(type == "iconBaseFood" && this.chef.grill.currentFood.length <= 6) {
            this.chef.addFood("noodles", 8, 4, 2, ["shortcake"]);
        }

        //--Get Hungriest customer
        this.hungerCountPos = this.hm.checkHungriest();

        //--Updage Grill Log
        this.chef.grill.updateLog(this.qualityResult.score, this.qualityResult.string);

        //--Feed Hungry (depending on input timing quality)
        //if(this.qualityResult.score > 0){
        if(this.hm.hungerCount[this.hungerCountPos] !== undefined){
            this.hm.hungerCount[this.hungerCountPos].feed(15, this.qualityResult.score);
        }
        this.chef.grill.addRep(this.qualityResult.score);
        //} else{this.chef.grill.subtractRep(1);}


    },
    beat: function(type){
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == type){
                this.inputs[input].beat(this.inputs[input].beatObj.duration, this.mu.trackInfo.bpm *.02, 1, 2)
            }
        }
    },
    updateEnsemble: function(input, type, x, y, distance, control, beatObj){
        this.inputs[input].input._destroy();
        this.inputs[input].iconTexture.destroy();
        this.inputs[input].button.destroy();
        this.inputs[input].si.indicators.destroy();
        this.inputs[input] = new InputEnsemble(type, x, y, distance, control, this, beatObj, this.tm)
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

function InputEnsemble(type, x, y, distance, input, parent, beat, tm){
    this.x = x;
    this.y = y;
    this.type = type;
    //this.bg = new ModSprite(x,y+25,beat.bgKey,{anchor:[0,1]});
    this.icon = new ModSprite(x,y, this.type, {scale:[1,1],make:true});
    this.button = new ModSprite(x+25,y+25,'buttonW', {anchor:[.5,.5],alpha:1,scale:[1,1]});
    this.beatObj = beat;
    this.iconTexture = this.icon.generateTexture();
    this.icon.destroy();
    this.si = new SlidingIndicator(x,y-distance, distance, this.iconTexture);
    this.input = input.onDown.add(function(){
        parent.action(this.beatObj.hitGoal, this.beatObj.qualityNumbers, this.beatObj.qualityNames, [this.x, this.y+25], this.type);
    }, this);
    game.world.bringToTop(tm.resultIndicator.indicators);
}

InputEnsemble.prototype = {
    beat: function(beatObjDuration, duration, alpha, scale){
        this.si.indicate(beatObjDuration);
        flash(this.button, duration, alpha, scale)
    }
};

