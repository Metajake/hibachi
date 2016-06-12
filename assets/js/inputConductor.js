function InputConductor(stage,chef, hm, mu, sm, tm){
    this.hm = hm;
    this.stage = stage;
    this.chef = chef;
    this.mu = mu;
    this.sm = sm;
    this.tm = tm;
    this.inputs = {
        one:new InputEnsemble("iconBaseFood", this.stage.colWidth*5.5, this.stage.colWidth*8.25, 50, controls.W, this, this.mu.beat8, this.tm, /*is interval*/true),
        two:new InputEnsemble("iconAdvancedTrick", this.stage.colWidth*7, this.stage.colWidth*9, 50, controls.D, this, this.mu.beat16, this.tm),
        three: new InputEnsemble("iconTrick", this.stage.colWidth*8.5, this.stage.colWidth*9, 50, controls.LEFT, this, this.mu.beat32, this.tm, true),
        four:new InputEnsemble("iconServe", this.stage.colWidth*10, this.stage.colWidth*8.25, 100, controls.UP, this, this.mu.beat4, this.tm, false, /*is disabled*/true),
        five:{},
        six:{},
        seven:{},
        eight:{},
        nine:{},
        ten:{}
    };
};

InputConductor.prototype = {
    action: function(goal, qualityNumbers, qualityNames, location, type, input, isInterval){
        //--Get Quality of Input Timing
        this.qualityResult = compareTiming(this.mu.theTime, goal, qualityNumbers, qualityNames, type);

        //--Select and Play random Sound effect
        this.choice = this.sm.getRand(this.sm.utinsels);
        this.choice.sound.play();

        //--Display Input Timing Quality
        this.tm.resultIndicator.shoot(this.qualityResult.sprite, 600, 100, location);

        //--Update Inputs according to quality
        //if(this.chef.grill.log.successfulHits >= 3 && this.inputs.two.beatObj == undefined){ // check for two.beatObj==undefined because otherwise it was throwing errors creating the second input (or something like that)
        //    this.updateEnsemble("one", "iconTrick", this.stage.colWidth*6.5, this.stage.colWidth*8.75, 40, controls.W, this.mu.beat16)
        //    this.inputs.two = new InputEnsemble("iconBaseFood", this.stage.colWidth*8, this.stage.colWidth*8.75, 80, controls.UP, this, this.mu.beat4, this.tm);
        //}

        //--Get Hungriest customer
        this.hungerCountPos = this.hm.checkHungriest();

        //--Check Type (add food, trick, serve food, etc.)
        if(type == "iconBaseFood") {
            //--Add Food to grill
            this.chef.addFood("noodles",/*animation Speed*/ 8,/*scale*/ 4,/*value*/ 2, ["shortcake"], /*isCooked*/100);
        }else if(type == "iconServe"){
            //--Serve Food
            this.foodAmount = this.chef.serveFood();
            //--Feed Hungry
            this.hm.hungerCount[this.hungerCountPos].feed(this.foodAmount, this.qualityResult.score);
        }

        //--Updage Grill Log
        this.chef.grill.updateLog(this.qualityResult, type);

        //--Update Grill Rep
        this.chef.grill.addRep(this.qualityResult.score);

        //--Set canHit to false if this is an "interval" note
        if(isInterval == true){input.canHit = false;};
        return this.qualityResult
    },
    beat: function(type){
        //--"Beat" the Indicators depending on type
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == type){
                this.inputs[input].beat(this.inputs[input].beatObj.duration, this.mu.trackInfo.bpm *.02, 1, 2)
            }
        }

        //--Add or Remove Third (advanced trick) input depending on trick average
        //if(this.inputs.three.beatObj == undefined && this.chef.grill.log.trickHitAverage == 1 && this.chef.grill.log.successfulHits > 3){
        //    this.inputs.three = new InputEnsemble("iconTrick", this.stage.colWidth*9.5, this.stage.colWidth*8.75, 80, controls.D, this, this.mu.beat4, this.tm);
        //}else if (this.chef.grill.log.trickHitAverage < 1 && this.inputs.three.beatObj !== undefined){
        //    this.removeEnsemble("three")
        //}
    },
    makeAllHittable: function(type){
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == type){
                this.inputs[input].canHit = true;
            }
        }
    },
    update: function(){
        for(hungry in this.hm.hungerCount){
            if(this.hm.hungerCount[hungry].waiting == true && this.chef.grill.containsFood == true){
                this.inputs.four.control.enabled = true;
                break;
            }else{
                this.inputs.four.control.enabled = false;
                break;
            };
        }
    },
    updateEnsemble: function(input, type, x, y, distance, control, beatObj){
        this.inputs[input].input._destroy();
        this.inputs[input].iconTexture.destroy();
        this.inputs[input].button.destroy();
        this.inputs[input].si.indicators.destroy();
        this.inputs[input] = new InputEnsemble(type, x, y, distance, control, this, beatObj, this.tm)
    },
    removeEnsemble: function(input){
        this.inputs[input].input._destroy();
        this.inputs[input].button.destroy();
        this.inputs[input].iconTexture.destroy();
        this.inputs[input].si.indicators.destroy();
        this.inputs[input].beatObj = undefined;
    }
};

function InputEnsemble(type, x, y, distance, input, parent, beat, tm, isInterval, isDisabled){
    this.x = x;
    this.y = y;
    this.type = type;
    this.beatObj = beat;
    //this.bg = new ModSprite(x,y+25,beat.bgKey,{anchor:[0,1]});
    this.button = new ModSprite(x+25,y+25,input.key, {anchor:[.5,.5],alpha:1,scale:[1,1]});
    this.icon = new ModSprite(x,y, this.type, {scale:[1,1],make:true});
    this.iconTexture = this.icon.generateTexture();
    this.icon.destroy();
    this.si = new SlidingIndicator(x,y-distance, distance, this.iconTexture);
    this.canHit = true;
    this.graphics = game.add.graphics(0,0);
    this.graphics.lineStyle(4, 0x00ff00);
    this.comboCount = 0;
    this.control = input.control;
    if(typeof(isDisabled) !== 'undefined'){this.control.enabled = false}
    this.input = input.control.onDown.add(function(){
        //!!! I might be able to reduce this to just "this.control.disabled" eventually.
        if(this.canHit == true){
            this.hitResult = parent.action(this.beatObj.hitGoal, this.beatObj.qualityNumbers, this.beatObj.qualityNames, [this.x, this.y+25], this.type, this, isInterval);
            //!!!!THIS ISN"T DOING ANYTHING RIGHT NOW, I THINK IT"S FOR POINTS
            // this.hit(this.hitResult)
        }
    }, this);
    game.world.bringToTop(tm.resultIndicator.indicators);
}

InputEnsemble.prototype = {
    beat: function(beatObjDuration, duration, alpha, scale){
        this.si.indicate(beatObjDuration);
        flash(this.button, duration, alpha, scale)
    },
    hit: function(result){
        //if(result.average == 1){
        //    switch(this.comboCount){
        //        case(0):
        //            this.graphics.arc(this.x+25, this.y+25,28,270*(Math.PI/180),0);
        //            break;
        //        case(1):
        //            this.graphics.arc(this.x+25, this.y+25,28,0,90*(Math.PI/180));
        //            break;
        //        case(2):
        //            this.graphics.arc(this.x+25, this.y+25,28,90*(Math.PI/180),180*(Math.PI/180));
        //            break;
        //        case(3):
        //            this.graphics.arc(this.x+25, this.y+25,28,180*(Math.PI/180),270*(Math.PI/180));
        //            break;
        //    };
        //    this.comboCount ++;
        //}
    }
};

