function SoundManager(){
    this.utinsels = [];
    this.sizzling = []
}

SoundManager.prototype = {
    constructSounds: function(){
        this.shkingSS1 = this.addSound('shking_soft_short1',1,this.utinsels);
        this.sharpenL1 = this.addSound('sharpen_long1',1,this.utinsels);
        this.sharpenL2 = this.addSound('sharpen_long2',1,this.utinsels);
        this.sharpenL3 = this.addSound('sharpen_long3',1,this.utinsels);
        this.sharpenS1 = this.addSound('sharpen_short1',1,this.utinsels);
        this.sharpenS2 = this.addSound('sharpen_short2',1,this.utinsels);
        this.sizzle1 = this.addSound('sizzle01',1,this.sizzling);
    },
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