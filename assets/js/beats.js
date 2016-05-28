//regBeatObj.prototype.expectBeat = function() {
//    this.neb = this.eb[this.sequenceExpectation];
//    if (this.neb == this.nextBeat) {
//        this.sequenceExpectation++;
//        this.neb = this.eb[this.sequenceExpectation];
//        this.startAcceptingInput = this.nextNotePrediction - this.qualityNumbers[4];
//        this.stopAcceptingInput = this.nextNotePrediction + this.qualityNumbers[4];
//        game.time.events.add(this.bpm * this.interval - this.qualityNumbers[4], function () {
//            this.indicator.glow(this.bpm * this.interval - this.qualityNumbers[4])
//        }, this);
//    }
//};
//
//regBeatObj.prototype.acceptInput = function(time){
//    if((time.ms >= this.startAcceptingInput) && (time.ms <= this.stopAcceptingInput)){
//        this.acceptingInput = true
//    }else{this.acceptingInput = false}
//};

BeatObj = function(trackInfo, division, qualityNumbers, qualityNames){
    this.currentBeat = 1;
    this.timeOfBeat = 0;
    this.trackInfo = trackInfo;
    this.qualityNames = qualityNames;
    this.qualityNumbers = qualityNumbers;
    this.duration = this.trackInfo.bpm / division;
    this.nextBeat = this.duration;
    this.hitGoal = this.nextBeat;
    this.declareHitGoal = this.hitGoal + this.qualityNumbers[0];
};

MusicObj = function(trackInfo, stage, im, hm, time){
    this.trackInfo = trackInfo;
    this.theTime = time - this.trackInfo.delay;
    this.stage = stage;
    //this.measureGraphics = graphics;
    this.im = im;
    this.hm = hm;
    this.bpm = trackInfo.bpm;
    this.duration = trackInfo.durationMS;
    this.durationMeasure = this.bpm*4;
    this.totalMeasures = Math.floor(this.duration / this.durationMeasure);
    this.beat32 = new BeatObj(trackInfo, 8, [(this.trackInfo.bpm/8) *.3], ["Good!","Bad"]);
    this.beat16 = new BeatObj(trackInfo, 4, [(this.trackInfo.bpm/4) * .30, (this.trackInfo.bpm/4) * .10], ["OK","Great!!","Bad"]);
    this.beat8 = new BeatObj(trackInfo, 2, [(this.trackInfo.bpm/2) *.3, (this.trackInfo.bpm/2) *.2, (this.trackInfo.bpm/2) * .1], ["OK", "Good!", "Great!!","Bad"]);
    this.beat4 = new BeatObj(trackInfo, 1, [this.trackInfo.bpm * .3 , this.trackInfo.bpm *.22, this.trackInfo.bpm *.14, this.trackInfo.bpm *.08], ["OK", "Good!", "Great!!", "PERFECT!!!", "Bad"]);
    this.measureCount= 1;
    this.nextMeasure = this.durationMeasure;

    //TEMP. REMOVED this.beatsMS = currentTrackInfo.beatsMS; // Expected Beats (based off audacity beat detector)
    //TEMP. REMOVED this.upcomingBeat = this.beatsMS[this.beatsMSCounter];
    //TEMP. REMOVED this.indicator = indicator;
    //TEMP. REMOVED this.beatsMSCounter = 0;
};

MusicObj.prototype.update = function(time){
    this.theTime = time - this.trackInfo.delay;

    //if(time >= this.trackInfo.startMS){
        if (this.theTime >= this.beat32.declareHitGoal) {
            this.beat32.declareHitGoal = this.beat32.nextBeat + this.beat32.qualityNumbers[0];
            this.beat32.hitGoal = this.beat32.nextBeat;
        }
        if (this.theTime >= this.beat16.declareHitGoal) {
            this.beat16.declareHitGoal = this.beat16.nextBeat + this.beat16.qualityNumbers[0];
            this.beat16.hitGoal = this.beat16.nextBeat;
        }
        if (this.theTime >= this.beat8.declareHitGoal) {
            this.beat8.declareHitGoal = this.beat8.nextBeat + this.beat8.qualityNumbers[0];
            this.beat8.hitGoal = this.beat8.nextBeat;
        }
        if (this.theTime >= this.beat4.declareHitGoal) {
            this.beat4.declareHitGoal = this.beat4.nextBeat + this.beat4.qualityNumbers[0];
            this.beat4.hitGoal = this.beat4.nextBeat;
        }
        if(this.theTime >= this.beat32.nextBeat){
            this.beat32.timeOfBeat = this.theTime;
            this.beat32.currentBeat ++;
            this.im.ts.indicate(this.beat32.duration);
            flash(this.stage.wButton, this.bpm *.01, 1, 2);
            this.beat32.nextBeat = this.theTime + this.beat32.duration;

            this.hm.update('sixteenth');

            if(this.theTime >= this.beat16.nextBeat){
                this.beat16.timeOfBeat = this.theTime;
                this.beat16.currentBeat ++;
                this.im.ss.indicate(this.beat16.duration);
                flash(this.stage.upButton, this.bpm *.02, 1, 2);
                this.beat16.nextBeat = this.theTime + this.beat16.duration;
                if(this.theTime >= this.beat8.nextBeat){
                    this.beat8.timeOfBeat = this.theTime;
                    this.beat8.currentBeat ++;
                    this.im.es.indicate(this.beat8.duration);
                    this.beat8.nextBeat = this.theTime + this.beat8.duration;
                    if(this.theTime >= this.beat4.nextBeat){
                        if(this.beat4.currentBeat % 4 == 0){
                            //this.setupMeasure(this.trackInfo.bpm*8);
                            this.measureCount ++;
                        }
                        this.beat4.timeOfBeat = this.theTime;
                        this.beat4.currentBeat ++;
                        this.im.qs.indicate(this.bpm);
                        this.beat4.nextBeat = this.theTime + this.bpm;
                        this.hm.update('quarter');
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

//MusicObj.prototype.setupMeasure = function(animDuration) {
//    this.measureGraphics.addMeasure(animDuration, this.trackInfo.measures[this.measureCount-1/*for zero indexing*/]);
//};
