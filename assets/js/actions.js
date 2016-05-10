function compareTiming(musicTime, goal, qualities, results){
    myBeatTime = musicTime
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

function actionOne(beatType, hm, musicTime , chef, mu){
    hungerCountPos = hm.checkHungriest();
    qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
    if(beatType == "thirtysecond"){
        mu.timingQuality32 = compareTiming(musicTime, mu.hitGoal32, mu.qualityNumbers32, qualityNames);
        //this.beatObj16.acceptInput(this.stageTimer)
        //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
        //    log("dance")
        //}
        if(["PERFECT","GREAT", "GOOD"].indexOf(mu.timingQuality32) !== -1){
            //hm.hungerCount[hungerCountPos].feed(hm.hungerCount,hungerCountPos, 15//, mu.timingQuality32)
        }
        //sndfx.clang1.play();
    } else if(beatType == "sixteenth"){
        mu.timingQuality16 = compareTiming(musicTime, mu.hitGoal16, mu.qualityNumbers16, qualityNames);
        //this.beatObj16.acceptInput(this.stageTimer)
        //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
        //    log("dance")
        //}
        if(["PERFECT","GREAT", "GOOD"].indexOf(mu.timingQuality16) !== -1){
            //hm.hungerCount[hungerCountPos].feed(hm.hungerCount,hungerCountPos, 30, mu.timingQuality16)
        }
    }else if(beatType == "eighth"){
        mu.timingQuality8 = compareTiming(musicTime, mu.hitGoal8, mu.qualityNumbers8, qualityNames);
        if(["PERFECT","GREAT", "GOOD"].indexOf(mu.timingQuality8) !== -1){
            //hm.hungerCount[hungerCountPos].feed(hm.hungerCount,hungerCountPos, 50, mu.timingQuality8)
        }
    }else {
        mu.timingQuality4 = compareTiming(musicTime, mu.hitGoal4, mu.qualityNumbers4, qualityNames);
        if (["PERFECT", "GREAT", "GOOD"].indexOf(mu.timingQuality4) !== -1) {
            //hm.hungerCount[hungerCountPos].feed(hm.hungerCount, hungerCountPos, 80, mu.timingQuality4)
        }
    }
    if(chef.grill.currentFood.length <= 6) {
        chef.grill.ndls = chef.addFood(200, 200, "noodles", 8, 4, 2, ["shortcake"]);
    }
}