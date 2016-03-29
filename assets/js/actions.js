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