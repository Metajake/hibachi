//NEW
var musicBeatObj = function(currentTrack, indicator){
    this.beatsMS = currentTrack.beatsMS;
    this.bpm = currentTrack.bpm;
    this.nextBpm = this.bpm;
    this.beatsMSCounter = 0;
    this.upcomingBeat = this.beatsMS[this.beatsMSCounter];
    this.indicator = indicator;
    this.timeOfBPM = 0;
};

musicBeatObj.prototype.update = function(time){
    if(time >= this.nextBpm){
        this.timeOfBPM = time
        this.nextBpm = time + this.bpm;
    }
    if(time >= this.upcomingBeat){
        this.indicator.flash(100)
        this.beatsMSCounter ++
        this.upcomingBeat = this.beatsMS[this.beatsMSCounter]
    }
};

BeatManager = function(){

};

BeatManager.prototype.constructBeats = function(currentTrack, sef, eef, qef, esb, eeb, eqb){
    this.beatObj16 = new regBeatObj(currentTrack, sef,.25, esb)
    this.beatObj8 = new regBeatObj(currentTrack, eef,.5, eeb);
    this.beatObj4 = new regBeatObj(currentTrack, qef,1, eqb);
}

var regBeatObj = function(bpm, indicator, interval, expectedBeats){
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

regBeatObj.prototype.noteCounter = function(time){
    this.notes ++;
    this.nextBeat ++;
    this.predictNextBeatTime(time);
    //this.expectBeat();
};

regBeatObj.prototype.predictNextBeatTime = function(time) {
    this.noteOccurance = time.ms;
    this.nextNotePrediction = this.noteOccurance + (this.bpm * this.interval);
};

regBeatObj.prototype.declareHitGoal = function(time){
    this.timeToDeclareHitGoal = this.nextNotePrediction - this.qualityNumbers[4];
    if (time.ms >= this.timeToDeclareHitGoal) {
        this.hitGoal = this.nextNotePrediction;
    };
};

regBeatObj.prototype.expectBeat = function() {
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

regBeatObj.prototype.acceptInput = function(time){
    if((time.ms >= this.startAcceptingInput) && (time.ms <= this.stopAcceptingInput)){
        this.acceptingInput = true
    }else{this.acceptingInput = false}
};