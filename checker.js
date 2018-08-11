var Lister = require('./lister');
var Poster = require('./poster');

function Checker(logger) {
    this.jams = {};
    this.poster = new Poster();
    this.lister = null;
    this.logger = logger;
}

Checker.prototype.notify = function(jams, minHours){
    jams.forEach(element => {
        var now = new Date();
        var hs = Math.abs(new Date(element.start) - now) / 36e5;
        this.logger.debug(hs +'<'+minHours);
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
        this.lister = new Lister(this.logger);
        var that = this;

        this.lister.getByHours(function(jams){ 
            that.logger.debug('candidate jams: ' + jams.length);
            that.notify(jams, 3);

            that.logger.debug('checking hours ' + that.poster.notifyQueue.length);
            that.lister.getByDays(function(jams){ 
                that.logger .debug('candidate jams: ' + jams.length);
                that.notify(jams, 72);

                that.logger.debug('checking days ' + that.poster.notifyQueue.length);
                that.lister.getByWeeks(function(jams){ 
                    that.logger .debug('candidate jams: ' + jams.length);
                    that.notify(jams, 504);
            
                    that.logger.debug('checking weeks ' + that.poster.notifyQueue.length);
                    if(that.poster.notifyQueue.length>0)
                        that.poster.postQueue();
                });
            });
        });
    } catch (error) {
        this.logger.error(error);
    }
}

module.exports = Checker;