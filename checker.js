var Lister = require('./lister');
var Poster = require('./poster');
var winston = require('winston');

function Checker() {
    this.jams = {};
    this.poster = new Poster();
    this.lister = null;
}

Checker.prototype.notify = function(jams, minHours){
    jams.forEach(element => {
        var now = new Date();
        var hs = Math.abs(new Date(element.start) - now) / 36e5;
        winston.log(hs +'<'+minHours);
        if(hs<minHours){
            var that = this;
            this.lister.updatePeriod(element.name, minHours, function(){
                that.poster.notifyQueue.push(element);
            }); 
        }
    });
}

Checker.prototype.nextWave = function(){
    try {
        this.lister = new Lister();
        var that = this;

        this.lister.getByHours(function(jams){ 
            winston.debug('candidate jams: ' + jams.length);
            that.notify(jams, 3);

            winston.debug('checking hours ' + that.poster.notifyQueue.length);
            that.lister.getByDays(function(jams){ 
                winston.debug('candidate jams: ' + jams.length);
                that.notify(jams, 72);

                winston.debug('checking days ' + that.poster.notifyQueue.length);
                that.lister.getByWeeks(function(jams){ 
                    winston.debug('candidate jams: ' + jams.length);
                    that.notify(jams, 504);
            
                    winston.debug('checking weeks ' + that.poster.notifyQueue.length);
                    if(that.poster.notifyQueue.length>0)
                        that.poster.postQueue();
                });
            });
        });
    } catch (error) {
        winston.error(error);
    }
}

module.exports = Checker;