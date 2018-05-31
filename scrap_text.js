var Xtractor = require('./xtractor.js');
var Checker = require('./checker.js');
var later = require('later');
/*
var xtractorSchedule = later.parse.recur().every(1).minute();
var xtractor = new Xtractor();
var xtractorTimer = later.setInterval(function(){ xtractor.getData(); }, xtractorSchedule);
*/
var checkerSchedule = later.parse.recur().every(1).minute();
var checker = new Checker();
var checkerTimer = later.setInterval(function(){checker.nextWave();}, checkerSchedule);


function exitHandler(options, err) {
  if(xtractorTimer)
    xtractorTimer.clear();

  if(checkerTimer)
    checkerTimer.clear();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
/*var a = $(this).prev();
  // Get the rank by parsing the element two levels above the "a" element
  var rank = a.parent().parent().text();
  // Parse the link title
  var title = a.text();
  // Parse the href attribute from the "a" element
  var url = a.attr('href');
  // Get the subtext children from the next row in the HTML table.
  var subtext = a.parent().parent().next().children('.subtext').children();
  // Extract the relevant data from the children
  var points = $(subtext).eq(0).text();
  var username = $(subtext).eq(1).text();
  var comments = $(subtext).eq(2).text();*/
