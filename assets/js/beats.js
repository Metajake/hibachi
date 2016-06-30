function compareTiming(musicTime, goal, qualities, resultNames){
    //--Determine comparison difference
    myBeatTime = musicTime;
    difference = Math.abs(goal - myBeatTime);

    //--Set base result values
    this.compareResult = {};
    this.compareResult.score = 1;
    this.compareResult.sprite = new BmpText('carrierCommand', resultNames[resultNames.length-1],12);
    this.compareResult.string = resultNames[resultNames.length-1];
    this.compareResult.success = false;

    //--set text sprite, score, and string depending on compare difference
    for (quality in qualities) {
        iterator = quality;
        if (difference < qualities[iterator]) {
            this.compareResult.sprite = new BmpText('carrierCommand', resultNames[iterator], 12);
            this.compareResult.score++;
            this.compareResult.string = resultNames[iterator];
        }
    }

    //--Declare hit successful if result in list of top three results
    if(["Good!", "Great!!", "PERFECT!!!"].indexOf(this.compareResult.string) !== -1){
        this.compareResult.success = true
    }

    //--Determine Average result depending on timing and length of qualities
    this.compareResult.average = this.compareResult.score / resultNames.length;

    return this.compareResult;
}

BeatObj = function(trackInfo, division, qualityNumbers, qualityNames, bgKey){
    this.bgKey = bgKey
    this.currentBeat = 1;
    this.timeOfBeat = 0;
    this.division = division;
    this.trackInfo = trackInfo;
    this.qualityNames = qualityNames;
    this.qualityNumbers = qualityNumbers;
    this.duration = this.trackInfo.bpm / this.division;
    this.nextBeat = this.duration;
    this.hitGoal = this.nextBeat;
    this.declareHitGoal = this.hitGoal + this.qualityNumbers[0];
};

MusicObj = function(trackInfo, stage, im, hm, time, inputConductor, chef){
    this.trackInfo = trackInfo;
    this.theTime = time - this.trackInfo.delay;
    this.stage = stage;
    //this.measureGraphics = graphics;
    this.im = im;
    this.hm = hm;
    this.ic = inputConductor;
    this.chef = chef;
    this.bpm = trackInfo.bpm;
    this.duration = trackInfo.durationMS;
    this.durationMeasure = this.bpm*4;
    this.totalMeasures = Math.floor(this.duration / this.durationMeasure);
    this.beat32 = new BeatObj(trackInfo, 8, [(this.trackInfo.bpm/8) *.3], ["Good!","Bad"], "bg32");
    this.beat16 = new BeatObj(trackInfo, 4, [(this.trackInfo.bpm/4) * .30, (this.trackInfo.bpm/4) * .10], ["OK","Great!!","Bad"], "bg16");
    this.beat8 = new BeatObj(trackInfo, 2, [(this.trackInfo.bpm/2) *.3, (this.trackInfo.bpm/2) *.2, (this.trackInfo.bpm/2) * .1], ["OK", "Good!", "Great!!","Bad"], "bg8");
    this.beat4 = new BeatObj(trackInfo, 1, [this.trackInfo.bpm * .3 , this.trackInfo.bpm *.22, this.trackInfo.bpm *.14, this.trackInfo.bpm *.08], ["OK", "Good!", "Great!!", "PERFECT!!!", "Bad"], "bg4");
    this.measureCount= 1;
    this.nextMeasure = this.durationMeasure;
    this.signalBeat = new Phaser.Signal();
    this.signalReset = new Phaser.Signal();

    //TEMP. REMOVED this.beatsMS = currentTrackInfo.beatsMS; // Expected Beats (based off audacity beat detector)
    //TEMP. REMOVED this.upcomingBeat = this.beatsMS[this.beatsMSCounter];
    //TEMP. REMOVED this.indicator = indicator;
    //TEMP. REMOVED this.beatsMSCounter = 0;
};

MusicObj.prototype = {
    update: function (time) {
        this.theTime = time - this.trackInfo.delay;

        if (this.theTime >= this.beat32.declareHitGoal) {
            this.beat32.declareHitGoal = this.beat32.nextBeat + this.beat32.qualityNumbers[0];
            this.beat32.hitGoal = this.beat32.nextBeat;
            this.signalBeat.dispatch(8);
            this.signalReset.dispatch(8);
        }
        if (this.theTime >= this.beat16.declareHitGoal) {
            this.beat16.declareHitGoal = this.beat16.nextBeat + this.beat16.qualityNumbers[0];
            this.beat16.hitGoal = this.beat16.nextBeat;
            this.signalBeat.dispatch(4);
            this.signalReset.dispatch(4);
        }
        if (this.theTime >= this.beat8.declareHitGoal) {
            this.beat8.declareHitGoal = this.beat8.nextBeat + this.beat8.qualityNumbers[0];
            this.beat8.hitGoal = this.beat8.nextBeat;
            this.signalBeat.dispatch(2);
            this.signalReset.dispatch(2);
        }
        if (this.theTime >= this.beat4.declareHitGoal) {
            this.beat4.declareHitGoal = this.beat4.nextBeat + this.beat4.qualityNumbers[0];
            this.beat4.hitGoal = this.beat4.nextBeat;
            this.signalBeat.dispatch(1);
            this.signalReset.dispatch(1);
        }

        if (this.theTime >= this.beat32.nextBeat) {
            this.beat32.timeOfBeat = this.theTime;
            this.beat32.currentBeat++;
            this.beat32.nextBeat = this.theTime + this.beat32.duration;

            //this.signalBeat.dispatch(8);

            // UPDATE - Increase cook time of Chef's Grill's current food
            this.chef.grill.cook()

            if (this.theTime >= this.beat16.nextBeat) {
                this.beat16.timeOfBeat = this.theTime;
                this.beat16.currentBeat++;
                this.beat16.nextBeat = this.theTime + this.beat16.duration;
                //this.signalBeat.dispatch(4);

                if (this.theTime >= this.beat8.nextBeat) {
                    this.beat8.timeOfBeat = this.theTime;
                    this.beat8.currentBeat++;
                    this.beat8.nextBeat = this.theTime + this.beat8.duration;
                    //this.signalBeat.dispatch(2);
                    if (this.theTime >= this.beat4.nextBeat) {
                        if (this.beat4.currentBeat % 4 == 0) {
                            //this.setupMeasure(this.trackInfo.bpm*8);
                            this.measureCount++;
                        }
                        this.beat4.timeOfBeat = this.theTime;
                        this.beat4.currentBeat++;
                        this.beat4.nextBeat = this.theTime + this.bpm;
                        //this.signalBeat.dispatch(1);
                        tweenTint(this.stage.bgSprite, 0xaa2222, 0xcc3300, this.bpm * .5)
                        this.hm.update('quarter');
                    }
                }
            }
        }

        // FOR "EXPECTED BEATS" (NEEDS AN INDICATOR OBJECT (TEMP. REMOVED))
        //if(time >= this.upcomingBeat){
        //    this.indicator.flash(100)
        //    this.beatsMSCounter ++
        //    this.upcomingBeat = this.beatsMS[this.beatsMSCounter]
        //}
    },
    setupMeasure: function (animDuration) {
        this.measureGraphics.addMeasure(animDuration, this.trackInfo.measures[this.measureCount - 1/*for zero indexing*/]);
    },
};
