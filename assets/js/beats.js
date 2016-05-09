BeatManager = function(){
    this.sixteenthTimeQuality = "";
    this.quarterTimeQuality = "";
    this.eighthTimeQuality = "";
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

//NEW
MusicBeatObj = function(currentTrack, graphics){
    this.track = currentTrack;
    this.measureGraphics = graphics;
    //TEMP. REMOVED this.beatsMS = currentTrack.beatsMS; // Expected Beats (based off audacity beat detector)
    this.bpm = currentTrack.bpm;
    this.duration = currentTrack.durationMS;
    this.measureLength = currentTrack.bpm*4;
    this.totalMeasures = this.duration / this.measureLength;
    this.currentQuarter = 1;
    this.measureCount= 0;
    this.eighth = this.track.bpm / 2;
    this.sixteenth = this.track.bpm / 4;
    this.thirtysecond = this.track.bpm / 8;
    this.nextBpm = this.bpm;
    this.nextMeasure = this.measure;
    this.nextEighth = this.eighth;
    this.nextSixteenth = this.sixteenth;
    this.nextThirtysecond = this.thirtysecond;
    this.beatsMSCounter = 0;
    //TEMP. REMOVED this.upcomingBeat = this.beatsMS[this.beatsMSCounter];
    //TEMP. REMOVED this.indicator = indicator;
    this.timeOfBPM = 0;
    this.timeOfEighth = 0;
    this.timeOfSixteenth = 0;
    this.timeOfThirtysecond = 0;
};

MusicBeatObj.prototype.update = function(time){
    //if(time >= this.track.startMS){
    //    log("started!")
        if(time >= this.nextThirtysecond){
            this.timeOfThirtysecond= time;
            this.nextThirtysecond = time + this.thirtysecond;
            if(time >= this.nextSixteenth){
                this.timeOfSixteenth = time;
                this.nextSixteenth = time + this.sixteenth;
                if(time >= this.nextEighth){
                    this.timeOfEighth = time;
                    this.nextEighth = time + this.eighth;
                    if(time >= this.nextBpm){
                        if(this.currentQuarter % 4 == 0){
                            this.setupMeasure()
                            this.measureCount ++;
                        }
                        this.currentQuarter ++;
                        this.timeOfBPM = time;
                        this.nextBpm = time + this.bpm;
                    }
                }
            }
        }
    //}

    // NEEDS AN INDICATOR OBJECT (TEMP. REMOVED)
    //if(time >= this.upcomingBeat){
    //    this.indicator.flash(100)
    //    this.beatsMSCounter ++
    //    this.upcomingBeat = this.beatsMS[this.beatsMSCounter]
    //}
};

MusicBeatObj.prototype.setupMeasure = function() {
    this.measureGraphics.addMeasure(this.track.measures[this.measureCount]);
}
