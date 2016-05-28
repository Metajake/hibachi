function compareTiming(musicTime, goal, qualities, resultNames){
    myBeatTime = musicTime;
    difference = Math.abs(goal - myBeatTime);

    this.compareResult = {};
    this.compareResult.score = 1;
    this.compareResult.sprite = new BmpText('carrierCommand', resultNames[resultNames.length-1],12);
    this.compareResult.string = resultNames[resultNames.length-1];

    for (quality in qualities){
        iterator = quality;
        if(difference < qualities[iterator]){
            this.compareResult.sprite = new BmpText('carrierCommand', resultNames[iterator],12);
            this.compareResult.score ++;
            this.compareResult.string = resultNames[iterator];
        }
    }
    return this.compareResult;
}

function actionOne(muBeat, hm, musicTime, chef, sm, tm, key){
    qualityResult = compareTiming(musicTime, muBeat.hitGoal, muBeat.qualityNumbers, muBeat.qualityNames);

    choice = sm.getRand(sm.utinsels);

    if(key !== undefined){event = {code:key};game.debug.text("Quality of Timing: "+qualityResult.string, 32, 32*14);
    }else{
        tm.resultIndicator.shoot(qualityResult.sprite, 600, 100, event.code);
        choice.sound.play()
    }

    //this.beatObj16.acceptInput(this.stageTimer)
    //if( ["PERFECT", "GOOD","GREAT"].indexOf(this.sixteenthTimeQuality) !== -1 && this.acceptingInput == true){
    //    log("dance")
    //}

    hungerCountPos = hm.checkHungriest();
    if(qualityResult.score > 1){
        if(hm.hungerCount[hungerCountPos] !== undefined){
            hm.hungerCount[hungerCountPos].feed(15, qualityResult.score);
        }
        chef.grill.rep += qualityResult.score;
    } else{chef.grill.rep -= 1;}


    if(chef.grill.currentFood.length <= 6) {
        chef.grill.ndls = chef.addFood(200, 200, "noodles", 8, 4, 2, ["shortcake"]);
    }
}