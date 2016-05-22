function HungryManager(stage){
    this.startingPoint = game.width - 100;
    this.hungerCount = [];
    this.stage = stage;
}

HungryManager.prototype = {
    update: function(){
        this.checkForHungry();
        for(hungry in this.hungerCount){
            //log(this.hungerCount[hungry].graphics.sprite.alive)
            //if (this.hungerCount[hungry].graphics.sprite.alive){
                this.hungerCount[hungry].step()
            //}else{log("sprite not alive. not adding Idle")};
        }
    },
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
    this.hungry = new Hungry(this.startingPoint, this.stage);
    this.hungerCount.push(this.hungry);
    return this.hungry;
};

function Hungry(originX, stage){
    this.animSprite = new AnimSprite(originX,510/*+ Math.floor(Math.random()*100)*/,"walkerGuy",[0],[5],4,1.2,stage.cropRectD);
    this.animSprite.walk = this.animSprite.sprite.animations.add('walk', [0,1,2,3,4]);
    this.hunger = 0;
    this.readyToEat = false;
    this.impatience = 0;
    this.fedCount = 0;
    this.ammused = 0;
    this.dissappointed = false;
}

Hungry.prototype = {
    update: function() {
        this.impatience += 1;
    },
    step: function(){
        currentX = this.animSprite.sprite.position.x;
        if (this.animSprite.sprite.position.x <= 200) {
            //music.bgm.stop();
            //game.state.start('splash');

        } else{
            this.moveLeft = game.add.tween(this.animSprite.sprite);
            this.moveLeft.to({x:currentX-100},1000,Phaser.Easing.Linear.None);
            this.moveLeft.onComplete.add(function(){this.animSprite.idle.play()},this);
            this.moveLeft.start();
            this.animSprite.walk.play(4,true);

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
        this.animSprite.sprite.position.x += feedAmount*multiplier;
        this.fedCount += 1;
        if(this.fedCount == 10){
            // CHANGE THIS TO DESTROY SOMEWHERE ELSE OR SOMETHING (for memory, but because it fucks up Step()
            this.animSprite.sprite.kill();
            toRemoveFrom.splice(toRemove,1);
        }
    }
};