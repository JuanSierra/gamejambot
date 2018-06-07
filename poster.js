var TwitterPackage = require('twitter');
//http://techknights.org/workshops/nodejs-twitterbot/
var fs = require('fs')
var secret = JSON.parse( fs.readFileSync('./secret', 'utf8') ); //require("./secret");
var later = require('later');

var posterSchedule = later.parse.recur().every(2).minute();
var posterTimer;
var Twitter = new TwitterPackage(secret);

function Poster() {
    this.notifyQueue = [];
}

Poster.prototype.postJam = function() {
    if (this.notifyQueue.length == 0){
      posterTimer.clear();
      return;
    }
    var jamToPost = this.notifyQueue.pop();

    /*Twitter.post('statuses/update', {status: jamToPost.short},  function(error, tweet, response){
        if(error){
          console.log(error);
        }
      });
    */
    var unit; 

    // recent time period is already in true
    if(!jamToPost.w3)
      unit = " weeks";
    else if(!jamToPost.d3)
      unit = " days";
    else
      unit = " hours";
    
    var body = new Date() + ' :: ' + jamToPost.name + ' :: ' + jamToPost.short + ' WHEN: < 3 ' + unit + '\n';
    fs.appendFile('dummy.txt', body, function (err) {
        if (err) throw err;
            console.log('Saved!');
    });
};

Poster.prototype.postQueue = function(){
    var that = this;
    posterTimer = later.setInterval(    function(){ that.postJam(); }, posterSchedule);
}

module.exports = Poster;