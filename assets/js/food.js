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
                key: "oilPour",
                scale:2,
                frameLength:13,
                speed:5
            },
        },
        2:{
            1:"1 0",
            2:"1 1"
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
            if(this.grill.positions[food].currentFood == undefined){
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
            this.grill.positions[this.openPosition].currentFood = addedFood;
            this.grill.positions[this.openPosition].currentFoodName = addedFood.name;
        }

        this.grill.checkContains();
    },
    advancedTrick: function(input){
        for(position in this.grill.positions){
            this.currentPos = this.grill.positions[position];
            if(this.currentPos.currentFoodName == 'advanced trick'){
                if(this.currentPos.currentFood.step < Object.keys(this.currentPos.currentFood.trickSequence).length){
                    this.currentPos.currentFood.animSprite.sprite.destroy();
                    this.currentPos.currentFood.animSprite = new AnimSprite(this.grill.positions[this.advTrick.openPosition].location[0],this.grill.positions[this.advTrick.openPosition].location[1]-25,this.advTrick.trickSequence[this.advTrick.step].key,utils.arrayRange(0,this.advTrick.trickSequence[this.advTrick.step].frameLength),[this.advTrick.trickSequence[this.advTrick.step].frameLength],this.advTrick.trickSequence[this.advTrick.step].speed,this.advTrick.trickSequence[this.advTrick.step].scale,this.stage.cropRectC);
                    this.stage.foodGroup.add(this.currentPos.currentFood.animSprite.sprite);
                    this.currentPos.currentFood.step ++;
                }else if(this.currentPos.currentFood.step == Object.keys(this.currentPos.currentFood.trickSequence).length){
                    this.currentPos.currentFood.animSprite.sprite.destroy();
                    this.currentPos.currentFood.animSprite = new SingleAnim(this.grill.positions[this.advTrick.openPosition].location[0],this.grill.positions[this.advTrick.openPosition].location[1]-25,this.advTrick.trickSequence[this.advTrick.step].key,this.advTrick.trickSequence[this.advTrick.step].speed,this.advTrick.trickSequence[this.advTrick.step].scale,this.stage.cropRectC);
                    this.currentPos.currentFoodName = undefined;
                    delete this.currentPos.currentFood
                }
                return
            }

        }
        this.openPosition = this.checkOpenPosition();
        if(this.openPosition !== undefined){
            this.currentPos = this.grill.positions[this.openPosition];
            this.advTrick = {step: 1};
            this.trickSelection = game.rnd.integerInRange(1,1/*Object.keys(this.tricks).length*/);
            this.advTrick.openPosition = this.openPosition;
            this.advTrick.trickSequence = this.tricks[this.trickSelection];
            this.advTrick.animSprite = new AnimSprite(this.currentPos.location[0],this.currentPos.location[1]-25,this.advTrick.trickSequence[this.advTrick.step].key,utils.arrayRange(0,this.advTrick.trickSequence[this.advTrick.step].frameLength),[this.advTrick.trickSequence[this.advTrick.step].frameLength],this.advTrick.trickSequence[this.advTrick.step].speed,this.advTrick.trickSequence[this.advTrick.step].scale,this.stage.cropRectC);
            this.stage.foodGroup.add(this.advTrick.animSprite.sprite);
            this.advTrick.step ++;
            this.currentPos.currentFood = this.advTrick;
            this.currentPos.currentFoodName = "advanced trick";
        }
        return this.advTrick
    },
    checkDone: function(){
        this.position = undefined;
        this.difference = 1;
        for(food in this.grill.positions){
            if(this.grill.positions[food].currentFoodName !==undefined){
                this.cookDifference = this.grill.positions[food].currentFood.isCooked - this.grill.positions[food].currentFood.cooked;
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
            this.foodAmount = this.grill.positions[mostCookedFood].currentFood.value;
            this.grill.positions[mostCookedFood].currentFood.animSprite.sprite.kill();
            delete this.grill.positions[mostCookedFood].currentFood;
            this.grill.positions[mostCookedFood].currentFoodName = undefined;
        }
        for(position in this.grill.positions){
            if(this.grill.positions[position].currentFoodName !== undefined){
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
    this.smell = 0; // USE THIS TO EFFECT NEARBY HUNGRY
    this.rep = 0; // Effect number of hungry
    this.averageTiming = 0;
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
            currentFoodName: undefined,
            location: [200,350]
        },
        two: {
            currentFoodName: undefined,
            location: [400,350]
        },
        three: {
            currentFoodName: undefined,
            location: [600,350]
        },
        four: {
            currentFoodName: undefined,
            location: [100,420]
        },
        five: {
            currentFoodName: undefined,
            location: [300,420]
        },
        six: {
            currentFoodName: undefined,
            location: [500,420]
        },
        seven: {
            currentFoodName: undefined,
            location: [700,420]
        }
    };
}

Grill.prototype = {
    checkFull: function(){
        for(position in this.positions){
            if(this.positions[position].currentFoodName == undefined){
                this.isFull = false;
                break;
            }else{
                this.isFull = true;
            }
        }
    },
    checkContains: function(){
        for (position in this.positions){
            if(this.positions[position].currentFoodName !== undefined){
                this.containsFood = true;
                return
            }else{
                //log(this.positions[position].currentFoodName)
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
            if(this.positions[food].currentFoodName !== undefined && this.positions[food].currentFoodName !== 'advanced trick'){
                this.positions[food].currentFood.cook()
                if(this.positions[food].currentFood.cooked >= this.positions[food].currentFood.maxCooked){
                    this.positions[food].currentFood.animSprite.sprite.kill();
                    delete this.positions[food].currentFood;
                    this.positions[food].currentFoodName = undefined;
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