var Lister = require('./lister.js');
var Poster = require('./poster.js');

function Checker() {
    this.jams = {};
    this.poster = new Poster();
}

Checker.prototype.notify = function(jams, minHours){
    var lister = new Lister();
    lister.open();

    jams.forEach(element => {
        var now = new Date();
        var hs = Math.abs(new Date(element.start) - now) / 36e5;
        console.log(hs)    
        if(hs<minHours){
            lister.updatePeriod(element.name, minHours);
            this.poster.notifyQueue.push(element);
        }
    });
}

Checker.prototype.nextWave = function(){
    var lister = new Lister();
    lister.open();
    var that = this;
    
    lister.getByDays(function(jams){ 
        console.log(jams.length);

        that.notify(jams, 80);

        console.log('checking ' + that.poster.notifyQueue.length);
        if(that.poster.notifyQueue.length>0)
            that.poster.postQueue();
    });
    
}

module.exports = Checker;