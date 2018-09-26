var logger = require('./logger');
var Xtractor = require('./xtractor');
var Checker = require('./checker');
var later = require('later');
var fs = require('fs');

var xtractorSchedule = later.parse.recur().every(24).hour();
var xtractor = new Xtractor(logger);
var xtractorTimer = later.setInterval(function(){ 
  try{
    xtractor.getData();  
  }catch(e){
    logger.error(e);
  }
}, xtractorSchedule);
var dbfile = 'daba';

// Create db file if it doesn't exist
fs.open(dbfile,'r',function(err, fd){
  if (err) {
    fs.writeFile(dbfile, '', function(err) {
        if(err) {
          logger.debug(err);
        }
        logger.debug("The file was saved!");
        // Initial fill
        xtractor.getData();
    });
  } else {
    logger.debug("The file exists!");
    // Initial fill
    xtractor.getData();
  }
});

var checkerSchedule = later.parse.recur().every(6).hour();
var checker = new Checker(logger);
var checkerTimer = later.setInterval(function(){
  try{
    checker.nextWave();
  }catch(e){
    logger.error(e);
  }
}, checkerSchedule);

function exitHandler(options, err) {
  if(err)
    logger.error(err);

  if(xtractorTimer)
    xtractorTimer.clear();

  if(checkerTimer)
    checkerTimer.clear();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
