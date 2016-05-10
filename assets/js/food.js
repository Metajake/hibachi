function Chef(stage) {
    this.stage = stage;
    this.grill = new Grill();
};

Chef.prototype.addFood = function(x,y,name,speed, scale, value, combinationList){
    if (this.grill.currentFood.indexOf(name) !== -1) {} else {
        food = new Food(x, y, name, speed, scale, value, combinationList, this.stage);
        this.grill.currentFood.push(food.name);
    }
    //log("The Grill contains: "+this.grill.currentFood);
};

function Food(x,y,name,speed, scale,value, combinationList, stage){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
    this.sprite = new FoodSprite(x,y,name,speed,scale, stage);
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
};

function Grill(){
    this.currentFood = [];
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