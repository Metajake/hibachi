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
            hungerLevels.push(this.hungerCount[hungry].hungerLevel)
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
    this.graphics = graphics
    this.graphics.lineStyle(2, 0x00ffFF, 1);
    this.graphics.drawRect(originX, 400+ Math.floor(Math.random()*100), 10,10);
    this.hungerLevel = 0;
    this.fedCount = 0;
}

Hungry.prototype = {
    update: function() {
        this.graphics.x -= .5;
        this.hungerLevel += 1;
        if (this.graphics.x <= -680) {
            music.bgm.stop();
            game.state.start('splash');
        }
    },
    feed: function(toRemoveFrom, toRemove, feedAmount, timingQuality){
        this.hungerLevel -=100;
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

var BeatObj = function(bpm, indicator, interval, expectedBeats){
    this.bpm = bpm;
    this.indicator = indicator;
    this.interval = interval;
    this.eb = expectedBeats;
    this.notes = 0;
    this.noteOccurance = 0;
    this.nextNotePrediction = this.noteOccurance + this.bpm * this.interval;
    this.nextBeat = 1;
    this.sequenceExpectation = 0;
    this.neb/*next expected beat*/ = this.eb[this.sequenceExpectation];
    this.qualityNumbers = [(this.bpm *this.interval) * .02, (this.bpm *this.interval) * .1,(this.bpm *this.interval) * .2,(this.bpm *this.interval) * .30,(this.bpm *this.interval) * .50];
    this.acceptingInput = false;
};

BeatObj.prototype.noteCounter = function(time){
    this.notes ++;
    this.nextBeat ++;
    this.predictNextBeatTime(time);
    this.expectBeat();
};

BeatObj.prototype.predictNextBeatTime = function(time) {
    this.noteOccurance = time.ms;
    this.nextNotePrediction = this.noteOccurance + (this.bpm * this.interval);
};

BeatObj.prototype.declareHitGoal = function(time){
    this.timeToDeclareHitGoal = this.nextNotePrediction - this.qualityNumbers[4];
    if (time.ms >= this.timeToDeclareHitGoal) {
        this.hitGoal = this.nextNotePrediction;
    };
};

BeatObj.prototype.expectBeat = function() {
    this.neb = this.eb[this.sequenceExpectation];
    if (this.neb == this.nextBeat) {
        this.sequenceExpectation++;
        this.neb = this.eb[this.sequenceExpectation];
        this.startAcceptingInput = this.nextNotePrediction - this.qualityNumbers[4];
        this.stopAcceptingInput = this.nextNotePrediction + this.qualityNumbers[4];
        game.time.events.add(this.bpm * this.interval - this.qualityNumbers[4], function () {
            this.indicator.glow(this.bpm * this.interval - this.qualityNumbers[4])
        }, this);
    };
};

BeatObj.prototype.acceptInput = function(time){
    if((time.ms >= this.startAcceptingInput) && (time.ms <= this.stopAcceptingInput)){
        this.acceptingInput = true
    }else{this.acceptingInput = false}
};
