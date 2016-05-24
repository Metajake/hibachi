function compareTiming(musicTime, goal, qualities, results){
    myBeatTime = musicTime;
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

function actionOne(muBeat, hm, musicTime, chef, sm){
    qualityNames = ["PERFECT", "GREAT","GOOD","OK","BAD","POOR"];
    muBeat.qualityResult = compareTiming(musicTime, muBeat.hitGoal, muBeat.qualityNumbers, qualityNames);

    //this.beatObj16.acceptInput(this.stageTimer)
    //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
    //    log("dance")
    //}

    hungerCountPos = hm.checkHungriest();
    if(["PERFECT","GREAT", "GOOD"].indexOf(muBeat.qualityResult) !== -1){
        if(hm.hungerCount[hungerCountPos] !== undefined){
            hm.hungerCount[hungerCountPos].feed(15, muBeat.qualityResult);
        }
        chef.grill.rep += 1;
    } else{chef.grill.rep -= 1;}

    choice = sm.getRand(sm.utinsels);
    choice.sound.play()

    if(chef.grill.currentFood.length <= 6) {
        chef.grill.ndls = chef.addFood(200, 200, "noodles", 8, 4, 2, ["shortcake"]);
    }
}