function HungryManager(){
    this.startingPoint = game.width - 100;
    this.hungerCount = []
}

HungryManager.prototype = {
    checkForHungry: function() {
        if (this.hungerCount.length < 5) {
            this.addHungry();
        }
    },
    checkHungriest: function(){
        hungerLevels = [];
        for(hungry in this.hungerCount){
            hungerLevels.push(this.hungerCount[hungry].impatience)
        }
        max = hungerLevels[0];
        maxIndex = 0;
        for(var i = 0;i< hungerLevels.length;i++){
            if (hungerLevels[i] > max){
                maxIndex = i;
                max = hungerLevels[i];
            }
        }
        return maxIndex
    }
};


HungryManager.prototype.addHungry = function(){
    this.hungry = new Hungry(game.add.graphics(0,0), this.startingPoint);
    this.hungerCount.push(this.hungry);
    return this.hungry;
};

function Hungry(graphics, originX){
    this.graphics = graphics;
    this.graphics.lineStyle(2, 0x00ffFF, 1);
    this.graphics.drawRect(originX, 500+ Math.floor(Math.random()*100), 10,10);
    this.hunger = 0;
    this.readyToEat = false;
    this.impatience = 0;
    this.fedCount = 0;
    this.ammused = 0;
    this.dissappointed = false;
}

Hungry.prototype = {
    update: function() {
        this.graphics.x -= .5;
        this.impatience += 1;
        if (this.graphics.x <= -680) {
            music.bgm.stop();
            game.state.start('splash');
        }
    },
    feed: function(toRemoveFrom, toRemove, feedAmount, timingQuality){
        this.impatience -=100;
        if (timingQuality== "PERFECT") {
            multiplier = 1.4
        } else if(timingQuality == "GREAT") {
            multiplier = 1.3
        } else if(timingQuality == "GOOD") {
            multiplier = 1.2
        } else {
            log("default");
        }
        this.graphics.x += feedAmount*multiplier;
        this.fedCount += 1;
        if(this.fedCount == 10){
            this.graphics.destroy()
            toRemoveFrom.splice(toRemove,1);
        }
    }
};