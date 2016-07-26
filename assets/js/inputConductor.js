function InputConductor(stage,chef, hm, mu, sm, tm){
    this.hm = hm;
    this.stage = stage;
    this.chef = chef;
    this.mu = mu;
    this.sm = sm;
    this.tm = tm;
    this.inputs = {
        trick:new InputEnsemble("iconTrick", this.stage.colWidth*8, this.stage.colWidth*9.25,/*remove this. its the same for all*/ 50, controls.S, this, this.mu.beat16two, this.tm, /*flash scale*/1.5,/*slide*/false),
        cook: new InputEnsemble("iconAddFood", this.stage.colWidth*6.5, this.stage.colWidth*8.5, 50, controls.A, this, this.mu.beat4, this.tm, 2, true),
        step: new InputEnsemble("iconStepFood", this.stage.colWidth*8, this.stage.colWidth*7.75, 50, controls.W, this, this.mu.beat8, this.tm, 2, true, /*is interval*/true),
        //advTrick:new InputEnsemble("iconAdvancedTrick", this.stage.colWidth*8.5, this.stage.colWidth*8.75, 50, controls.G, this, this.mu.beat4, this.tm, 2),
        serve:new InputEnsemble("iconServe", this.stage.colWidth*9.5, this.stage.colWidth*8.5, 50, controls.D, this, this.mu.beat4, this.tm, 2, true, false, /*is disabled*/true)
        //one:new InputEnsemble("iconBaseFood", this.stage.colWidth*5.5, this.stage.colWidth*8.25, 50, controls.W, this, this.mu.beat8, this.tm, 2, true),
        //five:{},
        //six:{},
        //seven:{},
        //eight:{},
        //nine:{},
        //ten:{}
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
        if(type == "iconAddFood") {
            //--Add Food to grill
            if(this.chef.grill.isFull !== true){
                this.chef.addFood();

            };

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
            input.hit(this.qualityResult, this.chef);

            //--Select and Play random Sound effect
            this.randSound = this.sm.getRand(this.sm.utinsels);
            this.randSound.sound.play();

            this.chef.basicTrickTween.start();
        }
        else if(type == "iconAdvancedTrick"){
            //--TEMP DISABLED (?)
            //this.inputs.trick.comboCount = 0;

            //this.chef.advancedTrick();
        }

        //--Updage Grill Log
        this.chef.grill.updateLog(this.qualityResult, type);

        //--Update Grill Rep
        this.chef.grill.addRep(this.qualityResult.score);

        //--Set canHit to false if this is an "interval" note
        if(isInterval == true){input.canHit = false;};
        return this.qualityResult
    },
    slide: function(division){
        //--"Beat" the Indicators depending on type. (this function call is signaled by MusicObj.BeatObj)
        for (input in this.inputs){
            if (this.inputs[input].beatObj.division == division){
                this.inputs[input].slide(this.inputs[input].beatObj.duration, this.mu.trackInfo.bpm *.02, 1, this.inputs[input].flashScale)
            }
        }

        //--Add or Remove Third (advanced trick) input depending on trick average
        //if(this.inputs.three.beatObj == undefined && this.chef.grill.log.trickHitAverage == 1 && this.chef.grill.log.successfulHits > 3){
        //    this.inputs.three = new InputEnsemble("iconTrick", this.stage.colWidth*9.5, this.stage.colWidth*8.75, 80, controls.D, this, this.mu.beat4, this.tm);
        //}else if (this.chef.grill.log.trickHitAverage < 1 && this.inputs.three.beatObj !== undefined){
        //    this.removeEnsemble("three")
        //}
    },
    flash: function(division){
        //--"Flash" the Indicators depending on type. (this function call is signaled by MusicObj.BeatObj)
        for (input in this.inputs){
            if (this.inputs[input].beatObj.division == division){
                this.inputs[input].flash(this.mu.trackInfo.bpm *.02, 1, this.inputs[input].flashScale)
            }
        }
    },
    resetHit: function(division){
        for (input in this.inputs){
            if (this.inputs[input].beatObj !== undefined && this.inputs[input].beatObj.division == division){
                this.inputs[input].canHit = true;
            }
        }
        //AND CHANGE THIS TO this.inputs.comboCount !!!!!!!
        //if(division == 4){
        //    if(this.inputs.trick.isHit == true && this.inputs.trick.comboCount <= 3){
        //        this.inputs.trick.comboUncount = 0;
        //        this.inputs.trick.comboCount ++;
        //    }else if(this.inputs.trick.isHit == false && this.inputs.trick.comboCount > 0){
        //        this.inputs.trick.comboUncount ++;
        //        if(this.inputs.trick.comboUncount == 8){
        //            this.inputs.trick.comboCount --;
        //            this.inputs.trick.comboUncount = 0;
        //        }
        //    }
        //    this.inputs.trick.checkCombo(this.inputs.trick.comboCount);
        //    this.inputs.trick.isHit = false;
        //}
    },
    update: function(){
        //Enable or Disable "Serve" input if grill has food and hungry are waiting
        //TEMP DISABLING //for(hungry in this.hm.hungerCount){
        //    if(this.hm.hungerCount[hungry].waiting == true && this.chef.grill.containsFood == true){
            if(this.chef.grill.containsFood == true){
                this.inputs.serve.enable();
                this.inputs.step.enable();
                //this.inputs.serve.control.enabled = true;
                //this.inputs.serve.disabledSprite.visible = false;
                //this.inputs.serve.si.indicators.alpha = 1;
                //break;
            }else{
                this.inputs.serve.disable();
                this.inputs.step.disable();
                //this.inputs.serve.control.enabled = false;
                //this.inputs.serve.disabledSprite.visible = true;
                //this.inputs.serve.si.indicators.alpha = 0;
                //break;
            }
        //}

        //Disable "Cook" input if Grill is full
        if(this.chef.grill.isFull == true){
            this.inputs.cook.control.enabled = false;
            this.inputs.cook.disabledSprite.visible = true;
            this.inputs.cook.si.indicators.alpha = 0;
        }else{
            this.inputs.cook.control.enabled = true;
            this.inputs.cook.disabledSprite.visible = false;
            this.inputs.cook.si.indicators.alpha = 1;
        }

        //Enable "Advanced Trick" input if BasicTrick "success average" gets to 4
        //if(this.inputs.trick.comboCount == 4){
        //    this.inputs.trick.type = "iconAdvancedTrick";
            //this.inputs.advTrick.control.enabled = true;
            //this.inputs.advTrick.disabledSprite.visible = false;
            //this.inputs.advTrick.si.indicators.alpha = 1;
        //}else{
        //    this.inputs.trick.type = "iconTrick";
            //this.inputs.advTrick.control.enabled = false;
            //this.inputs.advTrick.disabledSprite.visible = true;
            //this.inputs.advTrick.si.indicators.alpha = 0;
        //}
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

function InputEnsemble(type, x, y, distance, input, parent, beat, tm, flashScale, toSlide, isInterval, isDisabled){
    this.x = x;
    this.y = y;
    this.type = type;
    this.beatObj = beat;
    this.flashScale = flashScale;
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
    this.si = new SlidingIndicator(x,y-distance, distance+25, this.iconTexture);
    this.canHit = true;
    this.comboCount = 0;
    this.comboUncount = 0;
    this.isHit = false;
    this.control = input.control;
    this.toSlide = toSlide;
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
    slide: function(beatObjDuration){
        if(this.toSlide){
            this.si.indicate(beatObjDuration);
        }
    },
    flash: function(duration, alpha, scale){
        if(this.control.enabled == true){
            flash(this.button, duration, alpha, scale)
        }
    },
    hit: function(result, chef){
        if(result.success == true){
            //this.isHit = true;
            if(chef.canTrick == true){
                this.advTrickResult = chef.advancedTrick();
                chef.canTrick = false;
            }

            if(typeof(this.advTrickResult.animSprite) !== 'undefined'){
                this.advTrickResult.animSprite.sprite.animations.currentAnim.onComplete.add(function(){
                    chef.canTrick = true;
                },this);
            };
        }

        //else if(result.success == false && this.comboCount >0){
        //    log("was hit and combo count greated then zero");
        //    //this.comboCount --;
        //}

        //if(this.isHit == true && this.comboCount <= 3){
        //    this.comboUncount = 0;
        //    this.comboCount ++;
        //}
        //else if(this.isHit == false && this.comboCount > 0){
        //    this.inputs.trick.comboUncount ++;
        //    if(this.inputs.trick.comboUncount == 8){
        //        this.inputs.trick.comboCount --;
        //        this.inputs.trick.comboUncount = 0;
        //    }
        //}
        //this.checkCombo(this.comboCount);
        //this.isHit = false;
    },
    checkCombo: function(comboCount){
        //switch(this.comboCount){
        switch(comboCount){
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
    },
    enable: function(){
        this.control.enabled = true;
        this.disabledSprite.visible = false;
        this.si.indicators.alpha = 1;
    },
    disable: function(){
        this.control.enabled = false;
        this.disabledSprite.visible = true;
        this.si.indicators.alpha = 0;
    },
};