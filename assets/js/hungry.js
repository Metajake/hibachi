function HungryManager(stage, chef){
    this.chef = chef;
    this.startingPoint = game.width - 100;
    this.endingPoint = 100;
    this.totalCustomers = 0;
    this.dissatisfied = 0;
    this.hungerCount = {};
    this.stage = stage;
}

HungryManager.prototype = {
    update: function(beatType){
        if(beatType == 'quarter'){
            //--Check and Add new Hungry customer
            this.checkAddHungry();
            //--Step forward each Hungry (Walks forward, Increase Impatience, Leave Grill if Impatience threshold reached
            for(hungry in this.hungerCount){
                step(this.hungerCount[hungry], hungry)
            }
        }
    },
    checkAddHungry: function() {
        if (Object.keys(this.hungerCount).length < 5) {
            this.addHungry();
        }
    },
    checkHungriest: function(){
        hungerLevels = {};
        for(hungry in this.hungerCount){
            hungerLevels[hungry] = this.hungerCount[hungry].impatience;
        }
        max = hungerLevels[Object.keys(hungerLevels)[0]];
        maxIndex = Object.keys(hungerLevels)[0];
        for(level in hungerLevels){
            if (hungerLevels[level] > max){
                maxIndex = level;
                max = hungerLevels[level];
            }
        }
        return maxIndex
    },
    removeItem: function(key){
        if (!this.hungerCount.hasOwnProperty(key)){return}
        if (isNaN(parseInt(key)) || !(this.hungerCount instanceof Array)) {
            delete this.hungerCount[key]
        } else {
            this.hungerCount.splice(key, 1)
        }
    },
    addHungry: function(){
        this.hungry = new Hungry(this, this.startingPoint, this.endingPoint, this.stage, this.totalCustomers);
        this.hungerCount[this.totalCustomers] = this.hungry;
        this.totalCustomers ++;
        return this.hungry;
    }
};

function Hungry(manager, originX, endX, stage, index){
    this.manager = manager;
    this.animSprite = new AnimSprite(originX,515,"walkerGuy",[0],[5],4,1.2,stage.cropRectD);
    this.midSprite = new ModSprite(stage.colWidth*game.rnd.integerInRange(7,12),30,"hungryMid",{static:1,scale:[2.65,2.65],make:true,mask:stage.cropRectB});
    this.animSprite.walk = this.animSprite.sprite.animations.add('walk', [0,1,2,3,4]);
    this.destination = endX;
    this.waiting = false;
    this.index = index;
    this.tolerance = 50 + (randInt(3)*50);
    this.hunger = 0;
    this.impatience = 0;
    this.ammused = 0;
    this.dissappointed = false;
}

Hungry.prototype = {
    update: function() {
    },
    feed: function(feedAmount, timingScore){
        switch (timingScore) {
            case(5):
                multiplier = 1.4;
                break;
            case(4):
                multiplier = 1.3;
                break;
            case(3):
                multiplier = 1.2;
                break;
            default:
                multiplier = 1;
        }
        //!!!!! TO BE REPLACED WITH "appeased" function when doing Tricks
        //this.impatience -= feedAmount * multiplier;
        this.manager.chef.grill.rep += 10;
        // CHANGE THIS TO DESTROY SOMEWHERE ELSE OR SOMETHING (for memory, but because it fucks up Step()
        this.animSprite.sprite.kill();
        this.midSprite.destroy();
        this.manager.removeItem(this.index);
    }
};

function step(hungry, index){
    currentX = hungry.animSprite.sprite.position.x;
    if (hungry.animSprite.sprite.position.x > hungry.destination) {
        //music.bgm.stop();
        //game.state.start('splash');
        hungry.moveLeft = game.add.tween(hungry.animSprite.sprite);
        hungry.moveLeft.to({x:currentX-100},1000,Phaser.Easing.Linear.None);
        hungry.moveLeft.onComplete.add(function(){
            hungry.animSprite.idle.play();
            if(hungry.animSprite.sprite.position.x <= hungry.destination){
                hungry.waiting = true;
                game.add.existing(hungry.midSprite);
            }
        },this); //TROUBLE LINE (with KILL/DESTROY)
        hungry.moveLeft.start();
        hungry.animSprite.walk.play(4,true);

    } else{
        hungry.impatience += 20;
        if(hungry.impatience > hungry.tolerance){
            hungry.manager.chef.grill.rep -= 10;
            // CHANGE THIS TO DESTROY SOMEWHERE ELSE OR SOMETHING (for memory, but because it fucks up Step()
            hungry.midSprite.destroy();
            hungry.animSprite.sprite.kill();
            hungry.manager.removeItem(index);
        }
    }
}