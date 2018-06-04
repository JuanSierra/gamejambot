var Lister = require('./lister.js');
var Poster = require('./poster.js');

function Checker() {
    this.jams = {};
    this.poster = new Poster();
}

Checker.prototype.notify = function(jams, minHours){
    var lister = new Lister();

    jams.forEach(element => {
        var now = new Date();
        var hs = Math.abs(new Date(element.start) - now) / 36e5;
        console.log(hs +'<'+minHours);
        if(hs<minHours){
            console.log(element.name +' added')
            lister.updatePeriod(element.name, minHours); 
            this.poster.notifyQueue.push(element);
        }
    });
}

Checker.prototype.nextWave = function(){
    var lister = new Lister();
    var that = this;
    
    lister.getByHours(function(jams){ 
        console.log('candidate jams: ' + jams.length);
        that.notify(jams, 3);

        console.log('checking hours ' + that.poster.notifyQueue.length);
        lister.getByDays(function(jams){ 
            console.log('candidate jams: ' + jams.length);
            that.notify(jams, 72);

            console.log('checking days ' + that.poster.notifyQueue.length);
        
            lister.getByWeeks(function(jams){ 
                console.log('candidate jams: ' + jams.length);
                that.notify(jams, 504);
        
                console.log('checking weeks ' + that.poster.notifyQueue.length);
                if(that.poster.notifyQueue.length>0)
                    that.poster.postQueue();
            });
        });
    });
}

module.exports = Checker;