function InputConductor(stage,chef, hm, mu, sm, tm){
    this.hm = hm;
    this.stage = stage;
    this.chef = chef;
    this.mu = mu;
    this.sm = sm;
    this.tm = tm;
    this.inputs = {
        one:new InputEnsemble("iconBaseFood", this.stage.colWidth*5.5, this.stage.colWidth*8.25, 50, controls.W, this, this.mu.beat8, this.tm),
        two:new InputEnsemble("iconAdvancedTrick", this.stage.colWidth*7, this.stage.colWidth*9, 50, controls.D, this, this.mu.beat16, this.tm),
        three: new InputEnsemble("iconTrick", this.stage.colWidth*8.5, this.stage.colWidth*9, 50, controls.LEFT, this, this.mu.beat32, this.tm, /*is interval*/true),
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

        //--Display Input Timing Quality
        this.tm.resultIndicator.shoot(this.qualityResult.sprite, 600, 100, location);

        //--Get Hungriest customer
        this.hungerCountPos = this.hm.checkHungriest();

        //--Check Type (add food, trick, serve food, etc.)
        if(type == "iconBaseFood") {
            //--Add Food to grill
            this.chef.addFood("noodles",/*animation Speed*/ 8,/*scale*/ 4,/*value*/ 2, ["shortcake"], /*isCooked*/100, /*start frames*/utils.arrayRange(0,14));
            //this.randSound= this.sm.getRand(this.sm.sizzling);
            //this.randSound.sound.play("",0,0.6,true);
        }else if(type == "iconServe"){
            //--Serve Food
            this.foodAmount = this.chef.serveFood();
            //--Feed Hungry
            if(this.hungerCountPos !== undefined){
                this.hm.hungerCount[this.hungerCountPos].feed(this.foodAmount, this.qualityResult.score);
            }
        }else if(type=="iconTrick") {
            //--Send Timing Result to input.Hit() for determining success, combos
            input.hit(this.qualityResult)

            //--Select and Play random Sound effect
            this.randSound = this.sm.getRand(this.sm.utinsels);
            this.randSound.sound.play();

            this.chef.basicTrickTween.start();
        }else if(type == "iconAdvancedTrick"){
            this.chef.advancedTrick(input);
        }

        //--Updage Grill Log
        this.chef.grill.updateLog(this.qualityResult, type);

        //--Update Grill Rep
        this.chef.grill.addRep(this.qualityResult.score);

        log(this.chef.grill.positions);

        //--Set canHit to false if this is an "interval" note
        if(isInterval == true){input.canHit = false;};
        return this.qualityResult
    },
    beat: function(division){
        //--"Beat" the Indicators depending on type
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == division){
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
    resetHit: function(division){
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == division){
                this.inputs[input].canHit = true;
            }
        }
        if(division == 8){
            if(this.inputs.three.isHit == true && this.inputs.three.comboCount <= 3){
                this.inputs.three.comboUncount = 0;
                this.inputs.three.comboCount ++;
            }else if(this.inputs.three.isHit == false && this.inputs.three.comboCount > 0){
                this.inputs.three.comboUncount ++;
                if(this.inputs.three.comboUncount == 8){
                    this.inputs.three.comboCount --;
                    this.inputs.three.comboUncount = 0;
                }
            }
            this.inputs.three.checkCombo();
            this.inputs.three.isHit = false;
        }
    },
    update: function(){
        for(hungry in this.hm.hungerCount){
            if(this.hm.hungerCount[hungry].waiting == true && this.chef.grill.containsFood == true){
                this.inputs.four.control.enabled = true;
                this.inputs.four.disabledSprite.visible = false;
                this.inputs.four.si.indicators.alpha = 1;
                break;
            }else{
                this.inputs.four.control.enabled = false;
                this.inputs.four.disabledSprite.visible = true;
                this.inputs.four.si.indicators.alpha = 0;
                break;
            };
        }
        if(this.chef.grill.isFull == true){
            this.inputs.one.control.enabled = false;
            this.inputs.one.disabledSprite.visible = true;
            this.inputs.one.si.indicators.alpha = 0;
        }else{
            this.inputs.one.control.enabled = true;
            this.inputs.one.disabledSprite.visible = false;
            this.inputs.one.si.indicators.alpha = 1;
        }
        if(this.inputs.three.comboCount == 4){
            this.inputs.two.control.enabled = true;
            this.inputs.two.disabledSprite.visible = false;
            this.inputs.two.si.indicators.alpha = 1;
        }else{
            this.inputs.two.control.enabled = false;
            this.inputs.two.disabledSprite.visible = true;
            this.inputs.two.si.indicators.alpha = 0;
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
    this.graphics = game.add.graphics(0,0);
    this.graphics.lineStyle(4, 0x00ff00);
    this.button = new ModSprite(x+25,y+25,input.key, {anchor:[.5,.5],alpha:1,scale:[1,1]});
    this.disabledButton = game.make.bitmapData();
    this.disabledButton.load(input.key);
    this.disabledSprite =  this.disabledButton.addToWorld(x, y);
    this.disabledSprite.visible = false;
    this.disabledButton.shiftHSL(null, -1.0, null);
    this.icon = new ModSprite(x,y, this.type, {scale:[1,1],make:true});
    this.iconTexture = this.icon.generateTexture();
    this.icon.destroy();
    this.si = new SlidingIndicator(x,y-distance, distance, this.iconTexture);
    this.canHit = true;
    this.comboCount = 0;
    this.comboUncount = 0;
    this.isHit = false;
    this.control = input.control;
    if(typeof(isDisabled) !== 'undefined'){
        this.control.enabled = false;
        this.disabledSprite.visible = true;
        this.si.indicators.alpha = 0;
    }
    this.input = input.control.onDown.add(function(){
        //!!! I might be able to reduce this to just "this.control.disabled" eventually.
        if(this.canHit == true){
            this.hitResult = parent.action(this.beatObj.hitGoal, this.beatObj.qualityNumbers, this.beatObj.qualityNames, [this.x, this.y+25], this.type, this, isInterval);
        }
    }, this);
    game.world.bringToTop(tm.resultIndicator.indicators);
}

InputEnsemble.prototype = {
    beat: function(beatObjDuration, duration, alpha, scale){
        this.si.indicate(beatObjDuration);
        if(this.control.enabled == true){
            flash(this.button, duration, alpha, scale)
        }
    },
    hit: function(result){
        if(result.success == true){
            this.isHit = true;
        }else if(this.comboCount >0){this.comboCount --;}
    },
    checkCombo: function(){
        switch(this.comboCount){
            case(0):
                this.graphics.clear();
                break;
            case(1):
                this.graphics.clear();
                this.graphics.lineStyle(4, 0x00ff00);
                this.graphics.arc(this.x+25, this.y+25,28,270*(Math.PI/180),0);
                break;
            case(2):
                this.graphics.clear();
                this.graphics.lineStyle(4, 0x00ff00);
                this.graphics.arc(this.x+25, this.y+25,28,270*(Math.PI/180),90*(Math.PI/180));
                break;
            case(3):
                this.graphics.clear();
                this.graphics.lineStyle(4, 0x00ff00);
                this.graphics.arc(this.x+25, this.y+25,28,270*(Math.PI/180),180*(Math.PI/180));
                break;
            case(4):
                this.graphics.clear();
                this.graphics.lineStyle(4, 0x00ff00);
                this.graphics.drawCircle(this.x+25, this.y+25,56);
                break;
        };
    }
};