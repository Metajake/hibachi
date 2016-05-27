function compareTiming(musicTime, goal, qualities, results){
    myBeatTime = musicTime;
    difference = Math.abs(goal - myBeatTime);
    compareResult = {}

    if(difference < qualities[0]){
        compareResult.sprite = new BmpText('carrierCommand', results[0],12);
        compareResult.score = 5
    }else if (difference < qualities[1]){
        compareResult.sprite = new BmpText('carrierCommand', results[1],12);
        compareResult.score = 4
    }else if(difference < qualities[2]){
        compareResult.sprite = new BmpText('carrierCommand', results[2],12);
        compareResult.score = 3
    }else if(difference < qualities[3]){
        compareResult.sprite = new BmpText('carrierCommand', results[3],12);
        compareResult.score = 2
    }else if(difference < qualities[4]){
        compareResult.sprite = new BmpText('carrierCommand', results[4],12);
        compareResult.score = 1
    }else{
        compareResult.sprite = new BmpText('carrierCommand', results[5],12);
        compareResult.score = 0
    }

    return compareResult;
}

function actionOne(muBeat, hm, musicTime, chef, sm, tm){
    qualityNames = ["PERFECT!!!", "Great!!","Good!","OK","Bad","POOR"];
    qualityResult = compareTiming(musicTime, muBeat.hitGoal, muBeat.qualityNumbers, qualityNames);

    //this.beatObj16.acceptInput(this.stageTimer)
    //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
    //    log("dance")
    //}

    tm.resultIndicator.shoot(qualityResult.sprite, 600, 100, event.code);

    hungerCountPos = hm.checkHungriest();
    if(qualityResult.score >= 3){
        if(hm.hungerCount[hungerCountPos] !== undefined){
            hm.hungerCount[hungerCountPos].feed(15, qualityResult.score);
        }
        chef.grill.rep += 1;
    } else{chef.grill.rep -= 1;}

    choice = sm.getRand(sm.utinsels);
    choice.sound.play()

    if(chef.grill.currentFood.length <= 6) {
        chef.grill.ndls = chef.addFood(200, 200, "noodles", 8, 4, 2, ["shortcake"]);
    }
}