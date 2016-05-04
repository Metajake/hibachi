function compareTiming(timer, goal, qualities, results){
    myBeatTime = timer.ms;
    difference = Math.abs(goal - myBeatTime);
    if(difference < qualities[0]){
        timeQuality = results[0]
    }else if (difference < qualities[1]){
        timeQuality = results[1]
    }else if(difference < qualities[2]){
        timeQuality = results[2]
    }else if(difference < qualities[3]){
        timeQuality = results[3]
    }else if(difference < qualities[4]){
        timeQuality = results[4]
    }else{
        timeQuality = results[5]
    }
    return timeQuality
}

function noteCounter(bm, timer, im, bpm, hm){
    bm.beatObj16.noteCounter(timer);
    im.ss.indicate(bpm *.25);
    im.sf.flash(bpm *.02);
    if ( bm.beatObj16.notes % 2 == 0){
        bm.beatObj8.noteCounter(timer);
        im.es.indicate(bpm *.5);
        im.ef.flash(bpm *.02);
    }
    if (bm.beatObj16.notes % 4 == 0){
        bm.beatObj4.noteCounter(timer);
        im.qs.indicate(bpm);
        im.qf.flash(bpm *.02);
        hm.checkForHungry()
    }
}

function actionOne(beatType, hm, timer,bm, fm, stage){
    hungerCountPos = hm.checkHungriest();
    qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
    if(beatType == "sixteenth"){
        sixteenthTimeQuality = compareTiming(timer,bm.beatObj16.hitGoal, bm.beatObj16.qualityNumbers, qualityNames);
        //this.beatObj16.acceptInput(this.stageTimer)
        //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
        //    log("dance")
        //}
        if(["PERFECT","GREAT", "GOOD"].indexOf(sixteenthTimeQuality) !== -1){
            hm.hungerCount[hungerCountPos].feed(hm.hungerCount,hungerCountPos, 30, sixteenthTimeQuality)
        }
    }else if(beatType == "eighth"){
        eighthTimeQuality = compareTiming(timer,bm.beatObj8.hitGoal, bm.beatObj8.qualityNumbers, qualityNames);
        if(["PERFECT","GREAT", "GOOD"].indexOf(eighthTimeQuality) !== -1){
            hm.hungerCount[hungerCountPos].feed(hm.hungerCount,hungerCountPos, 50, eighthTimeQuality)
        }
    }else {
        quarterTimeQuality = compareTiming(timer, bm.beatObj4.hitGoal, bm.beatObj4.qualityNumbers, qualityNames);
        if (["PERFECT", "GREAT", "GOOD"].indexOf(quarterTimeQuality) !== -1) {
            hm.hungerCount[hungerCountPos].feed(hm.hungerCount, hungerCountPos, 80, quarterTimeQuality)
        }
    }
    fm.ndls = fm.addFood("noodles",2,["shortcake"]);
}