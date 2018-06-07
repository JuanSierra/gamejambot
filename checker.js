var Lister = require('./lister.js');
var Poster = require('./poster.js');

function Checker() {
    this.jams = {};
    this.poster = new Poster();
    this.lister = null;
}

Checker.prototype.notify = function(jams, minHours){
    jams.forEach(element => {
        var now = new Date();
        var hs = Math.abs(new Date(element.start) - now) / 36e5;
        console.log(hs +'<'+minHours);
        if(hs<minHours){
            var that = this;
            this.lister.updatePeriod(element.name, minHours, function(){
                that.poster.notifyQueue.push(element);
            }); 
        }
    });
}

Checker.prototype.nextWave = function(){
    this.lister = new Lister();
    var that = this;

    this.lister.getByHours(function(jams){ 
        console.log('candidate jams: ' + jams.length);
        that.notify(jams, 3);

        console.log('checking hours ' + that.poster.notifyQueue.length);
        that.lister.getByDays(function(jams){ 
            console.log('candidate jams: ' + jams.length);
            that.notify(jams, 72);

            console.log('checking days ' + that.poster.notifyQueue.length);
            that.lister.getByWeeks(function(jams){ 
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