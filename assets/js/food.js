function Chef(stage) {
    this.stage = stage;
    this.grill = new Grill(this.stage);
}

Chef.prototype = {
    checkGrill: function(){
        this.number = undefined;
        for(food in this.grill.positions){
            if(this.grill.positions[food].currentFood == undefined){
                this.number = food;
                break;
            }
        }
        log("next open grill spot: "+ this.number);
        return this.number;
    },
    addFood: function(name,speed, scale, value, combinationList){
        log("Chef adding food to..");
        this.number = this.checkGrill();
        if(this.number !== undefined){
            addedFood = new Food(this.grill.positions[this.number].location[0], this.grill.positions[this.number ].location[1], name, speed, scale, value, combinationList, this.stage);
            this.grill.positions[this.number].currentFood = addedFood.name;
        }

        //if (this.grill.currentFood.indexOf(name) !== -1) {} else {
        //    food = new Food(x, y, name, speed, scale, value, combinationList, this.stage);
        //    this.grill.currentFood.push(food.name);
        //}

        //log("The Grill contains: "+this.grill.currentFood);
    }
};

function Food(x,y,name,speed, scale,value, combinationList, stage){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
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

function Grill(stage){
    this.stage = stage;
    this.currentFood = [];
    this.smell = 0; // USE THIS TO EFFECT NEARBY HUNGRY
    this.rep = 0;
    this.averageTiming = 0;
    this.timingScores = 0;
    this.totalHits = 0;
    this.log = {
        perfect:{count:0,string:"Perfect"},
        great:{count:0,string:"Great"},
        good:{count:0,string:"Good"},
        ok:{count:0,string:"Ok"},
        bad:{count:0,string:"Bad"},
        poor:{count:0,string:"Poor"}
    };
    this.repTextShadow = game.add.bitmapText(this.stage.colWidth+2, this.stage.colWidth*3+2, 'carrierCommand', 'Rep:'+ this.rep, 14);
    this.repTextShadow.tint = 0x000000;
    this.repText = game.add.bitmapText(this.stage.colWidth, this.stage.colWidth*3, 'carrierCommand', 'Rep:'+ this.rep, 14);
    this.averageTextShadow = game.add.bitmapText(this.stage.colWidth+2, this.stage.colWidth*3.5+2, 'carrierCommand', 'Average:'+ this.averageTiming, 14);
    this.averageTextShadow.tint = 0x000000;
    this.averageText = game.add.bitmapText(this.stage.colWidth, this.stage.colWidth*3.5, 'carrierCommand', 'Average:'+ this.averageTiming, 14);
    this.recentQualities = [];
    this.positions = {
        one: {
            currentFood: undefined,
            location: [200,350]
        },
        two: {
            currentFood: undefined,
            location: [400,350]
        },
        three: {
            currentFood: undefined,
            location: [600,350]
        },
        four: {
            currentFood: undefined,
            location: [100,420]
        },
        five: {
            currentFood: undefined,
            location: [300,420]
        },
        six: {
            currentFood: undefined,
            location: [500,420]
        },
        seven: {
            currentFood: undefined,
            location: [700,420]
        }
    };
}

Grill.prototype = {
    updateLog: function(score, string){
        this.timingScores += score;
        this.totalHits++;
        this.averageTiming = this.timingScores/ this.totalHits;
        log(score)
        log(this.averageTiming);
        this.averageTextShadow.text = "Average:"+this.averageTiming;
        this.averageText.text = "Average:"+this.averageTiming;

        this.recentQualities.push(string);

        //switch(string){
        //    case("PERFECT!!!"):
        //        this.log.perfect ++;
        //        break;
        //    case("Great!!"):
        //        this.log.great ++;
        //        break;
        //    case("Good!"):
        //        this.log.good ++;
        //        break;
        //    case("OK"):
        //        this.log.ok ++;
        //        break;
        //    case("Bad"):
        //        this.log.bad ++;
        //        break;
        //    case("POOR"):
        //        this.log.poor ++;
        //
        //\     break;
        //};
        //log(this.log.perfect)
        //let average = this.log[0].count;
        //for(score in this.log){
        //    if(this.log[score].count > this.average){
        //        this.averageTiming = this.log[score].string;
        //    }
        //};
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