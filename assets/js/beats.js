BeatManager = function(trackInfo, im){
    this.thirtysecondTimeQuality = "";
    this.sixteenthTimeQuality = "";
    this.quarterTimeQuality = "";
    this.eighthTimeQuality = "";
    this.beatObj32 = new regBeatObj(trackInfo.bpm, im.tef,.125, trackInfo.etb)
    this.beatObj16 = new regBeatObj(trackInfo.bpm, im.sef,.25, trackInfo.esb)
    this.beatObj8 = new regBeatObj(trackInfo.bpm, im.eef,.5, trackInfo.eeb);
    this.beatObj4 = new regBeatObj(trackInfo.bpm, im.qef,1, trackInfo.eqb);
};

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

regBeatObj.prototype.update =   function(time){
    this.declareHitGoal(time);
};

regBeatObj.prototype.noteCounter = function(time){
    //this.notes ++;
    //this.nextBeat ++;
    this.predictNextBeatTime(time);
    //IMPORTANT EXPECT BEAT CALL
    //this.expectBeat();
};

regBeatObj.prototype.predictNextBeatTime = function(time) {
    this.notes ++;
    this.nextBeat ++;
    this.noteOccurance = time;
    this.nextNotePrediction = this.noteOccurance + (this.bpm * this.interval);
};

regBeatObj.prototype.declareHitGoal = function(time){
    this.timeToDeclareHitGoal = this.nextNotePrediction - this.qualityNumbers[4];
    if (time >= this.timeToDeclareHitGoal) {
        this.hitGoal = this.nextNotePrediction;
    }
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
    }
};

regBeatObj.prototype.acceptInput = function(time){
    if((time.ms >= this.startAcceptingInput) && (time.ms <= this.stopAcceptingInput)){
        this.acceptingInput = true
    }else{this.acceptingInput = false}
};

MusicBeatObj = function(trackInfo, graphics, bm, im, hm){
    this.trackInfo = trackInfo;
    this.measureGraphics = graphics;
    this.bm = bm;
    this.im = im;
    this.hm = hm;
    this.bpm = trackInfo.bpm;
    this.duration = trackInfo.durationMS;
    this.durationMeasure = this.bpm*4;
    this.totalMeasures = this.duration / this.durationMeasure;
    this.current4 = 1;
    this.current8 = 1;
    this.current16 = 1;
    this.current32 = 1;
    this.measureCount= 1;
    this.duration4 = this.bpm;
    this.duration8 = this.trackInfo.bpm / 2;
    this.duration16 = this.trackInfo.bpm / 4;
    this.duration32 = this.trackInfo.bpm / 8;
    this.qualityNumbers32 = [(this.duration32) * .02, (this.duration32) * .1,(this.duration32) * .2,(this.duration32) * .30,(this.duration32) * .50];
    this.qualityNumbers16 = [(this.duration16) * .02, (this.duration16) * .1,(this.duration16) * .2,(this.duration16) * .30,(this.duration16) * .50];
    this.qualityNumbers8 = [(this.duration8) * .02, (this.duration8) * .1,(this.duration8) * .2,(this.duration8) * .30,(this.duration8) * .50];
    this.qualityNumbers4 = [(this.duration4) * .02, (this.duration4) * .1,(this.duration4) * .2,(this.duration4) * .30,(this.duration4) * .50];
    this.timingQuality32 = "";
    this.timingQuality16 = "";
    this.timingQuality8 = "";
    this.timingQuality4 = "";
    this.nextMeasure = this.durationMeasure;
    this.next4 = this.duration4;
    this.next8 = this.duration8;
    this.next16 = this.duration16;
    this.next32 = this.duration32;
    this.timeOf4 = 0;
    this.timeOf8 = 0;
    this.timeOf16 = 0;
    this.timeOf32 = 0;
    this.hitGoal32 = this.duration32;
    this.hitGoal16 = this.duration16;
    this.hitGoal8 = this.duration8;
    this.hitGoal4 = this.duration4;
    this.declareHitGoal32 = this.next32 - this.qualityNumbers32[4];
    this.declareHitGoal16 = this.next16 - this.qualityNumbers16[4];
    this.declareHitGoal8 = this.next8 - this.qualityNumbers8[4];
    this.declareHitGoal4 = this.next4 - this.qualityNumbers4[4];
    //TEMP. REMOVED this.beatsMS = currentTrackInfo.beatsMS; // Expected Beats (based off audacity beat detector)
    //TEMP. REMOVED this.upcomingBeat = this.beatsMS[this.beatsMSCounter];
    //TEMP. REMOVED this.indicator = indicator;
    //TEMP. REMOVED this.beatsMSCounter = 0;
};

MusicBeatObj.prototype.update = function(time){
    this.declareHitGoal32 = this.next32 - this.qualityNumbers32[4];
    this.declareHitGoal16 = this.next16 - this.qualityNumbers16[4];
    this.declareHitGoal8 = this.next8 - this.qualityNumbers8[4];
    this.declareHitGoal4 = this.next4 - this.qualityNumbers4[4];

    //if(time >= this.trackInfo.startMS){
        if (time >= this.declareHitGoal32) {
            //log("declare 32!")
            this.hitGoal32 = this.next32;
        }
        if (time >= this.declareHitGoal16) {
            this.hitGoal16 = this.next16;
        }
        if (time >= this.declareHitGoal8) {
            this.hitGoal8 = this.next8;
        }
        if (time >= this.declareHitGoal4) {
            this.hitGoal4 = this.next4;
        }
        if(time >= this.next32){
            this.timeOf32 = time;
            this.current32 ++;
            //this.bm.beatObj32.predictNextBeatTime(time);
            //this.bm.beatObj32.declareHitGoal(time);
            //this.noteCounter(this.timeOf32);
            this.im.ts.indicate(this.duration32);
            this.im.tf.flash(this.bpm *.02);
            this.next32 = time + this.duration32;
            if(time >= this.next16){
                this.timeOf16 = time;
                this.current16 ++;
                //this.noteCounter(this.timeOf32);
                this.im.ss.indicate(this.duration16);
                this.im.sf.flash(this.bpm *.02);
                this.next16 = time + this.duration16;
                if(time >= this.next8){
                    this.timeOf8 = time;
                    this.current8 ++;
                    this.im.es.indicate(this.duration8);
                    this.im.ef.flash(this.bpm *.02);
                    //this.noteCounter(this.timeOf8);
                    //this.bm.beatObj8.predictNextBeatTime(time);
                    //this.bm.beatObj8.declareHitGoal(time);
                    this.next8 = time + this.duration8;
                    if(time >= this.next4){
                        if(this.current4 % 4 == 0){
                            this.setupMeasure()
                            this.measureCount ++;
                        }
                        this.timeOf4 = time;
                        this.current4 ++;
                        //this.bm.beatObj4.predictNextBeatTime(time);
                        //this.bm.beatObj4.declareHitGoal(time);
                        //this.noteCounter(this.timeOf4);
                        this.im.qs.indicate(this.bpm);
                        this.im.qf.flash(this.bpm *.02);
                        this.next4 = time + this.bpm;
                        this.hm.checkForHungry()
                    }
                }
            }
        }
    //} // end if (time>= music.startMS)

    // NEEDS AN INDICATOR OBJECT (TEMP. REMOVED)
    //if(time >= this.upcomingBeat){
    //    this.indicator.flash(100)
    //    this.beatsMSCounter ++
    //    this.upcomingBeat = this.beatsMS[this.beatsMSCounter]
    //}
};

MusicBeatObj.prototype.setupMeasure = function() {
    this.measureGraphics.addMeasure(this.trackInfo.measures[this.measureCount-1/*for zero indexing*/]);
};
