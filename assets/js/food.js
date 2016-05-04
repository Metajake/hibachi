function FoodManager(stage) {
    this.stage = stage;
    this.grill = new Grill();
};

FoodManager.prototype.addFood = function(name, value, combinationList){
    food = new Food(name, value, combinationList, this.stage)
    this.grill.currentFood.push(food.name)
    log("Grill contains "+this.grill.currentFood);
    return food
};

function Food(name, value, combinationList, stage){
    this.name = name;
    this.value = value;
    this.combinationList = combinationList;
    if(this.name = "noodles"){
        this.sprite = new FoodSprite(200,200,"noodles",10,3.5, stage);
    }
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

stbry.combine(shrtck)

alert(stbry.getName())
*/