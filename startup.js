var winston = require('winston');
var logger = require('./logger');   

var Xtractor = require('./xtractor');
var Checker = require('./checker');
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
          winston.debug(err);
        }
        winston.debug("The file was saved!");
        // Initial fill
        xtractor.getData();
    });
  } else {
    winston.debug("The file exists!");
    // Initial fill
    xtractor.getData();
  }
});

var checkerSchedule = later.parse.recur().every(6).hour();
var checker = new Checker();
var checkerTimer = later.setInterval(function(){checker.nextWave();}, checkerSchedule);

function exitHandler(options, err) {
  if(err)
    winston.error(err);

  if(xtractorTimer)
    xtractorTimer.clear();

  if(checkerTimer)
    checkerTimer.clear();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
