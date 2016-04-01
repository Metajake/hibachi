music = {
    witit:{
        bpm:857*4,
        name: 'witit',
        esb:[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        eeb:[8, 18, 34, 38, 42, 46, 50, 54, 60, 64, 68, 72, 76, 80],
        eqb:[2,4, 12, 16, 20, 22, 26, 30, 34, 38, 42, 46]
    },
    work:{
        bpm:619,
        name: 'work'
    }
};

var BeatObj = function(bpm, indicator, interval, expectedBeats){
    //log("instantiating beat obj 2")
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
            this.indicator.flash(this.bpm * this.interval - this.qualityNumbers[4])
        }, this);
    };
};

BeatObj.prototype.acceptInput = function(time){
    if((time.ms >= this.startAcceptingInput) && (time.ms <= this.stopAcceptingInput)){
        this.acceptingInput = true
    }else{this.acceptingInput = false}
};
