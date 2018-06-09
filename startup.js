var Xtractor = require('./xtractor.js');
var Checker = require('./checker.js');
var later = require('later');
var fs = require('fs');

var xtractorSchedule = later.parse.recur().every(24).hour();
var xtractor = new Xtractor();
var xtractorTimer = later.setInterval(function(){ xtractor.getData(); }, xtractorSchedule);
var dbfile = 'daba';

// Create db file if it doesn't exist
fs.open(dbfile,'r',function(err, fd){
  if (err) {
    fs.writeFile(dbfile, '', function(err) {
        if(err) {
            console.log(err);
        }
        console.log("The file was saved!");
    });
  } else {
    console.log("The file exists!");
  }
});

// Initial fill
xtractor.getData();

var checkerSchedule = later.parse.recur().every(6).hour();
var checker = new Checker();
var checkerTimer = later.setInterval(function(){checker.nextWave();}, checkerSchedule);

function exitHandler(options, err) {
  if(xtractorTimer)
    xtractorTimer.clear();

  if(checkerTimer)
    checkerTimer.clear();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
