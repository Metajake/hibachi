function SoundManager(){
    this.utinsels = [];
}

SoundManager.prototype = {
    addSound: function(key, vol, group){
        this.sound = new SoundObj(key, vol);
        group.push(this.sound);
        return this.sound
    },
    getRand: function(group){
        sound = group[Math.floor(group.length * Math.random())];
        return sound
    }
}

function SoundObj(key, vol){
    this.sound = game.add.audio(key);
    this.volume = vol;
}