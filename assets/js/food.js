function Chef(stage) {
    this.stage = stage;
    this.grill = new Grill(this.stage);
    this.portrait = new AnimSprite(120,70, "chefPortrait",[0,1],[0,1],1,3,this.stage.cropRectA);
    this.leftHand = new AnimSprite(290,275, "leftHand",[0,0],[0,0],1,3.5,this.stage.cropRectC);
    this.stage.hands.add(this.leftHand.sprite);
    this.basicTrickTween = game.add.tween(this.leftHand.sprite);
    this.basicTrickTween.to({x:this.leftHand.sprite.position.x +40,y:this.leftHand.sprite.position.y+25},250,Phaser.Easing.Circular.InOut,false, 0,0,true);
    this.tricks = {
        1:{
            1:{
                key: "oilPour",
                scale:2,
                frameLength:13,
                speed:10
            },
            2:{
                key: "fireFromOil",
                scale:1.75,
                frameLength:13,
                speed:10
            },
        },
        2:{
            1:{
                key: "oilPour",
                scale:2,
                frameLength:13,
                speed:10
            },
            2:{
                key: "fireFromOil",
                scale:1.75,
                frameLength:13,
                speed:10
            },
        }
    }
}

Chef.prototype = {
    update: function(){
        this.grill.checkFull();
    },
    checkOpenPosition: function(){
        this.number = undefined;
        for(food in this.grill.positions){
            if(this.grill.positions[food].content == undefined){
                this.number = food;
                break;
            }
        }
        return this.number;
    },
    addFood: function(name,speed, scale, value, combinationList, isCooked, start){
        this.openPosition = this.checkOpenPosition();
        if(this.openPosition !== undefined){
            addedFood = new Food(this.grill.positions[this.openPosition].location[0], this.grill.positions[this.openPosition ].location[1], name, speed, scale, value, combinationList, this.stage, isCooked, start);
            this.grill.positions[this.openPosition].content = addedFood;
            this.grill.positions[this.openPosition].contentName = addedFood.name;
            this.grill.positions[this.openPosition].contentType = "food";
        }

        this.grill.checkContains();
    },
    advancedTrick: function(input){
        //--Loop over all grill positions
        for(position in this.grill.positions){
            //--Define Current Grill Loop position (for brevity)
            this.currentPos = this.grill.positions[position];
            //--If Grill loop position type is an "advanced trick"...
            if(this.currentPos.contentType == 'advanced trick'){
                //--Define step in 'advanced trick' sequence (for brevity)
                this.advTrickStep = this.advTrick.trickSequence[this.advTrick.step];
                //--...If there are more steps in the 'advanced trick' sequence
                if(this.currentPos.content.step < Object.keys(this.currentPos.content.trickSequence).length){
                    //--Destroy exsisting 'advanced trick' sprite (to make room for next step sprite)
                    this.currentPos.content.animSprite.sprite.destroy();
                    //--Instantiate new animated sprite in 'advanced trick' sequence
                    this.currentPos.content.animSprite = new AnimSprite(this.grill.positions[this.advTrick.openPosition].location[0],this.grill.positions[this.advTrick.openPosition].location[1]-25,this.advTrickStep.key,utils.arrayRange(0,this.advTrickStep.frameLength),[this.advTrickStep.frameLength],this.advTrickStep.speed,this.advTrickStep.scale,this.stage.cropRectC);
                    //--Add new animated sprite to 'stage food group'
                    this.stage.foodGroup.add(this.currentPos.content.animSprite.sprite);
                    //--Increase step in 'advanced trick' sequence
                    this.currentPos.content.step ++;
                //--...if this is the last step in the 'advanced trick' sequence
                }else if(this.currentPos.content.step == Object.keys(this.currentPos.content.trickSequence).length){
                    //--Destroy exsisting 'advanced trick' sprite (to make room for next step sprite)
                    this.currentPos.content.animSprite.sprite.destroy();
                    //--Instantiate new 'single sprite' in 'advanced trick' sequence
                    this.currentPos.content.animSprite = new SingleAnim(this.grill.positions[this.advTrick.openPosition].location[0],this.grill.positions[this.advTrick.openPosition].location[1]-25,this.advTrickStep.key,this.advTrickStep.speed,this.advTrickStep.scale,this.stage.cropRectC);
                    //--Define Grill loop position back to 'undefined'
                    this.currentPos.contentType = undefined;
                    //--Delete 'advanced trick' object from Grill loop position
                    delete this.currentPos.content
                }
                return
            }

        }
        //--If no 'advanced trick' exists on grill define next avaiable open position
        this.openPosition = this.checkOpenPosition();
        //--If there is an open grill position
        if(this.openPosition !== undefined){
            //--Define open grill position (for brevity)
            this.currentPos = this.grill.positions[this.openPosition];
            //--Define 'advanced trick' object
            this.advTrick = {step: 1};
            //--Define 'advanced trick' position as open grill position
            this.advTrick.openPosition = this.openPosition;
            //--Define 'advanced trick' sequence as random trick selection
            this.advTrick.trickSequence = this.tricks[game.rnd.integerInRange(1,Object.keys(this.tricks).length)];
            //--Define step in 'advanced trick' sequence (for brevity)
            this.advTrickStep = this.advTrick.trickSequence[this.advTrick.step];
            //--Instantiate first animated sprite in 'advanced trick' sequence
            this.advTrick.animSprite = new AnimSprite(this.currentPos.location[0],this.currentPos.location[1]-25,this.advTrickStep.key,utils.arrayRange(0,this.advTrickStep.frameLength),[this.advTrickStep.frameLength],this.advTrickStep.speed,this.advTrickStep.scale,this.stage.cropRectC);
            //--Add 'advanced trick' to stage food group
            this.stage.foodGroup.add(this.advTrick.animSprite.sprite);
            //--Increase step in 'advanced trick' sequence
            this.advTrick.step ++;
            //--Define Grill open position content as new advanced trick
            this.currentPos.content = this.advTrick;
            //--Define Grill open position content type
            this.currentPos.contentType = "advanced trick";
        }
        return this.advTrick
    },
    checkDone: function(){
        this.position = undefined;
        this.difference = 1;
        for(food in this.grill.positions){
            if(this.grill.positions[food].contentName !== undefined && this.grill.positions[food].contentType !== 'advanced trick'){
                this.cookDifference = this.grill.positions[food].content.isCooked - this.grill.positions[food].content.cooked;
                if(this.position == undefined){
                    this.difference = this.cookDifference;
                    this.position = food;
                }
                if(this.cookDifference <= this.difference){
                    this.difference = this.cookDifference;
                    this.position = food;
                };
            }
        }

        return this.position
    },
    serveFood: function(){
        this.foodAmount = 0;

        //--determine food closest to it's cooked time
        mostCookedFood = this.checkDone();

        //--serve, and remove food from grill if there is one
        if(mostCookedFood !== undefined){
            this.foodAmount = this.grill.positions[mostCookedFood].content.value;
            this.grill.positions[mostCookedFood].content.animSprite.sprite.kill();
            delete this.grill.positions[mostCookedFood].content;
            this.grill.positions[mostCookedFood].contentName = undefined;
            this.grill.positions[mostCookedFood].contentType = undefined;
        }
        for(position in this.grill.positions){
            if(this.grill.positions[position].contentName !== undefined){
                this.grill.containsFood = true;
                break;
            }else{this.grill.containsFood = false;}
        }

        //this.grill.checkFull();

        return this.foodAmount
    }
};

function Food(x,y,name,speed, scale,value, combinationList, stage, maxCooked, start){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
    this.cooked = 0;
    this.maxCooked = maxCooked;
    this.isCooked = this.maxCooked - (this.maxCooked / 4);
    this.animSprite = new AnimSprite(x,y,name,start,[14],speed,scale, stage.cropRectC);
    this.animSprite.sprite.anchor.setTo(0.5,1);
    stage.foodGroup.add(this.animSprite.sprite);
}

Food.prototype = {
    combine: function(otherFood){
        if(this.combinationList.indexOf(otherFood.getName()) != -1){
            isValid = true;
            this.decoratedFood = otherFood;
        } else {
            isValid=false;
        }
        return isValid;
    },
    eat: function(){
        if(!this.decoratedFood){
            return this.value;
        }
        else{
            return this.decoratedFood.eat() + this.value;
        }
    },
    getName: function(){
        if(!this.decoratedFood){
            return this.name;
        } else {
            return this.name + " and " + this.decoratedFood.getName()
        }
    },
    cook: function(){
        this.cooked += 2;
    }
};

function Grill(stage){
    this.stage = stage;
    this.smell = 0; // TO EFFECT NEARBY HUNGRY???
    this.rep = 0; // Effect number of hungry
    this.totalHits = 0;
    this.containsFood = false;
    this.isFull = false;
    this.log = {
        successfulHits:0,
        trickHitAmounts: [],
        trickHitAverage: 0,
        hitList: [],
    };
    this.repTextShadow = game.add.bitmapText(this.stage.colWidth+2, this.stage.colWidth*3+2, 'carrierCommand', 'Rep:'+ this.rep, 14);
    this.repTextShadow.tint = 0x000000;
    this.repText = game.add.bitmapText(this.stage.colWidth, this.stage.colWidth*3, 'carrierCommand', 'Rep:'+ this.rep, 14);
    this.successTextShadow = game.add.bitmapText(this.stage.colWidth+2, this.stage.colWidth*3.5+2, 'carrierCommand', 'Successful Hit Count:'+ this.log.successfulHits, 14);
    this.successTextShadow.tint = 0x000000;
    this.successText = game.add.bitmapText(this.stage.colWidth, this.stage.colWidth*3.5, 'carrierCommand', 'Successful Hit Count:'+ this.log.successfulHits, 14);
    this.hitListText = game.add.bitmapText(this.stage.colWidth, this.stage.colWidth*4, 'carrierCommand', 'Recent:'+ this.log.hitList.slice(Math.max(this.log.hitList.length - 4, 0)), 10);
    this.positions = {
        one: {
            content: undefined,
            location: [200,350]
        },
        two: {
            content: undefined,
            location: [400,350]
        },
        three: {
            content: undefined,
            location: [600,350]
        },
        four: {
            content: undefined,
            location: [100,420]
        },
        five: {
            content: undefined,
            location: [300,420]
        },
        six: {
            content: undefined,
            location: [500,420]
        },
        seven: {
            content: undefined,
            location: [700,420]
        }
    };
}

Grill.prototype = {
    checkFull: function(){
        for(position in this.positions){
            if(this.positions[position].contentName == undefined){
                this.isFull = false;
                break;
            }else{
                this.isFull = true;
            }
        }
    },
    checkContains: function(){
        for (position in this.positions){
            if(this.positions[position].contentName !== undefined){
                this.containsFood = true;
                return
            }else{
                //log(this.positions[position].contentName)
                this.containsFood = false;
            }
        }
    },
    updateLog: function(result, type){
        this.totalHits++;

        if(result.success == true){this.log.successfulHits ++};
        this.successTextShadow.text = 'Successful Hits:'+ this.log.successfulHits;
        this.successText.text = 'Successful Hits:'+ this.log.successfulHits;

        this.log.hitList.push(result.string);
        this.hitListText.text = 'Recent Hits:'+ this.log.hitList.slice(Math.max(this.log.hitList.length - 4, 0));

        if(type == "iconTrick"){
            //this.log.trickHitList.push(result.string);
            this.log.trickHitAmounts.push(result.average);
            this.log.trickHitAverage = this.log.trickHitAmounts.slice(Math.max(this.log.trickHitAmounts.length - 4, 0)).reduce(function(a,b){return a+b}, 0) / this.log.trickHitAmounts.slice(Math.max(this.log.trickHitAmounts.length - 4, 0)).length;
        }
    },
    addRep: function(amount){
        this.rep += amount;
        this.repTextShadow.text = "Rep:"+this.rep
        this.repText.text = "Rep:"+this.rep
    },
    subtractRep: function(amount){
        this.rep -= amount;
        this.repTextShadow.text = "Rep:"+this.rep
        this.repText.text = "Rep:"+this.rep
    },
    cook: function(){
        for(food in this.positions){
            if(this.positions[food].contentName !== undefined && this.positions[food].contentType !== 'advanced trick'){
                this.positions[food].content.cook()
                if(this.positions[food].content.cooked >= this.positions[food].content.maxCooked){
                    this.positions[food].content.animSprite.sprite.kill();
                    delete this.positions[food].content;
                    this.positions[food].contentName = undefined;
                    this.checkContains();
                }
            }
        }

    }
};

/*
function MultiplierFood(name, value, combinationList){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
    this.combine = function(otherFood){
        if(this.combinationList.indexOf(otherFood.getName()) != -1){
            isValid = true;
            this.decoratedFood = otherFood;
        } else {
            isValid=false;
        }
        return isValid;
    };
    this.eat = function(){
        if(!this.decoratedFood){
            return this.value;
        }
        else{
            return this.decoratedFood.eat() * this.value;
        }
    };
    this.getName = function(){
        if(!this.decoratedFood){
            return this.name;
        } else {
            return this.name + " and " + this.decoratedFood.getName()
        }
    }
};

var brslsprt = new Food("brussels sprout", 9,["butter"]);

 //this.fm.ndls = this.fm.addFood("w",2,["shortcake"]);
 //this.fm.shrtck = this.fm.addFood("shortcake",10,[]);
 //this.fm.ndls.combine(this.fm.shrtck)
stbry.combine(shrtck)

alert(stbry.getName())
*/