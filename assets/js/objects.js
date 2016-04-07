function HungryManager(){
    this.theHungry = game.add.group();
    this.hungryGraphics = game.add.graphics(0,0);
    log(this.hungryGraphics)
    this.startingPoint = game.width - 100;
    //this.firstHungry =
    this.hungerCount = []
}

HungryManager.prototype = {
    checkForHungry: function() {
        if (this.hungerCount.length < 10) {
            this.addHungry();
        }
    },
    checkHungriest: function(){
        hungerLevels = [];
        for(hungry in this.hungerCount){
            hungerLevels.push(this.hungerCount[hungry].hungerLevel)
        }
        log(hungerLevels)
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
    graphics.lineStyle(2, 0x00ffFF, 1);
    this.hungry = graphics.drawRect(originX, 400+ Math.floor(Math.random()*100), 10,10);
    this.hungerLevel = 0;
    log(this.hungry.x)

}

Hungry.prototype = {
    update: function() {
        this.hungry.x -= .5;
        this.hungerLevel += 1;
        if (this.hungry.x <= -680) {
            music.bgm.stop();
            game.state.start('splash');
        }
    },
    feed: function(){
        this.hungerLevel -=100;
        this.hungry.x += 30;
    }
}