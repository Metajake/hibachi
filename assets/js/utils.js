var utils = {
    centerGameObjects: function (objects) {objects.forEach(function (object) {object.anchor.setTo(0.5);});},
    arrayRange: function (low,high){
        var list = [];
        for (var i = low; i <= high; i++) {
            list.push(i);
        }
        return list
    }

};

function Map(map, results){

}

function log(toLog){
    console.log(toLog);
}

function pause_game(event){
    if(controls.SPACE.altKey){
        if (game.stepping){
            game.disableStep()
            music.bgm.resume()
        }else{
            game.enableStep()
            game.stepCount = 1;
            music.bgm.pause()
        }
    }else{
        if (game.paused){
            game.paused = false;
            music.bgm.resume()
        } else{
            game.paused = true;
            music.bgm.pause()
        }
    }
}

function gofull(){
    if (controls.P.altKey){ if (game.scale.isFullScreen){ game.scale.stopFullScreen(); } else { game.scale.startFullScreen(false); }; };
}

function step_game(event){
    if(game.stepping){
        game.step();
    }
}

//RANDOM NUMBER

function randInt(limit){
    if(limit !== "undefined"){
        return Math.floor(limit * Math.random());
    }else{return Math.floor(Math.random()*100);}
}