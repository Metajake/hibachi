function Chef(stage) {
    this.stage = stage;
    this.grill = new Grill(this.stage);
    this.food = {};
    this.foodCount = 0;
}

Chef.prototype = {
    checkGrill: function(){
        this.number = undefined;
        log(this.grill.positions)
        for(food in this.grill.positions){
            if(this.grill.positions[food].currentFood == undefined){
                this.number = food;
                break;
            }
        }
        return this.number;
    },
    addFood: function(name,speed, scale, value, combinationList, isCooked){
        this.openPosition = this.checkGrill();
        if(this.openPosition !== undefined){
            addedFood = new Food(this.grill.positions[this.openPosition].location[0], this.grill.positions[this.openPosition ].location[1], name, speed, scale, value, combinationList, this.stage, isCooked);
            //foodId = 'id_'+this.foodCount;
            //this.food[foodId] = new Food(this.grill.positions[this.openPosition].location[0], this.grill.positions[this.openPosition ].location[1], name, speed, scale, value, combinationList, this.stage, isCooked);
            //this.foodCount ++;
            this.grill.positions[this.openPosition].currentFood = addedFood;
            this.grill.positions[this.openPosition].currentFoodName = addedFood.name;
        }

        //if (this.grill.currentFood.indexOf(name) !== -1) {} else {
        //    food = new Food(x, y, name, speed, scale, value, combinationList, this.stage);
        //    this.grill.currentFood.push(food.name);
        //}

        //log("The Grill contains: "+this.grill.currentFood);
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
       /* for(food in this.grill.positions){
            if(this.grill.positions[food].currentFoodName !== undefined){
                if(this.grill.positions[food].currentFood.isCooked - this.grill.positions[food].currentFood.cooked < this.difference) {
                    this.result = food;
                    break;
                }
            }
        }*/
        return this.position
    },
    serveFood: function(){
        mostCookedFood = this.checkDone();
        if(mostCookedFood !== undefined){
            this.grill.positions[mostCookedFood].currentFood.animSprite.sprite.kill();
            delete this.grill.positions[mostCookedFood].currentFood;
            this.grill.positions[mostCookedFood].currentFoodName = undefined;
        }
    }
};

function Food(x,y,name,speed, scale,value, combinationList, stage, maxCooked){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
    this.cooked = 0;
    this.maxCooked = maxCooked;
    this.isCooked = this.maxCooked - (this.maxCooked / 4);
    this.animSprite = new AnimSprite(x,y,name,utils.arrayRange(0,14),[14],speed,scale, stage.cropRectC);
    this.animSprite.sprite.anchor.setTo(0.5,1)
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
            return this.decoratedFood.eat() + this.value;
        }
    };
    this.getName = function(){
        if(!this.decoratedFood){
            return this.name;
        } else {
            return this.name + " and " + this.decoratedFood.getName()
        }
    }
}

Food.prototype = {
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
            if(this.positions[food].currentFoodName !== undefined){
                this.positions[food].currentFood.cook()
                if(this.positions[food].currentFood.cooked >= this.positions[food].currentFood.maxCooked){
                    this.positions[food].currentFood.animSprite.sprite.kill();
                    delete this.positions[food].currentFood;
                    this.positions[food].currentFoodName = undefined;
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