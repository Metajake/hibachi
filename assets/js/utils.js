var utils = {
    centerGameObjects: function (objects) {objects.forEach(function (object) {object.anchor.setTo(0.5);});},
}

function log(toLog){
    console.log(toLog);
}

function pause_game(event){
    if(controls.SPACE.altKey){
        if (game.stepping){
            game.disableStep()
        }else{
            game.enableStep()
            game.stepCount = 1;
        }
    }else{
        if (game.paused){
            game.paused = false;
        } else{
            game.paused = true;
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