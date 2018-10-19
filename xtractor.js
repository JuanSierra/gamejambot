const BODY_OPEN = '<html><body>';
const BODY_CLOSE = '</body></html>';

var request = require('request');
var cheerio = require('cheerio');
var Jam = require('./jam');

var Extrator = require("html-extractor");
var myExtrator = new Extrator();

var Lister = require('./lister');

function Xtractor(logger) {
    this.parsedResults = [];
    this.lister = new Lister(logger);
    this.logger = logger;
}

Xtractor.prototype.getData = function(){
    var that = this;
    this.logger.debug('Getting data...');

    request('https://itch.io/jams', function (error, response, html) {
        if(error)
            that.logger.error(error);

        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
    
            $('.jam_cell span a').each( function(i, element) {
                var t = $(this).text();
                var url = $(this).attr('href');

                // Our parsed meta data object
                var metadata = {
                    name: t,
                    url: url
                };
                // Push meta-data into parsedResults array
                that.parsedResults.push(metadata);
            });
        }

        that.cleanJamResults();

        return callb();
    });

    function callb (){
        var name, start, end, short;

        that.parsedResults.forEach(function(element){
            request('https://itch.io' + element.url, function (error, response, html) {
                //console.log('https://itch.io' + element.url)
                if(error)
                    that.logger.error(error);
                
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    var dates = $('span.date_format');
                    var content = $('div.jam_content');
    
                    if (dates.length == 2){
                        name = element.name;
                        start = $(dates[0]).text();
                        end = $(dates[1]).text();

                        myExtrator.extract( BODY_OPEN + $.html(content) + BODY_CLOSE , function( err, data ){
                            if( err ){
                                throw( err )
                            } else {
                                short = data.body.substring(0, 100);
                            }
                        });
                        
                        //lister = new Lister();
                        that.lister.insertJam( new Jam(
                            {
                                name : name,
                                start : start,
                                end : end,
                                short : short
                            })
                        );
                    }
                }
            });
        });
    }
}

Xtractor.prototype.cleanJamResults = function(){
    var keys = [];
    var filteredResults = [];
    this.logger.debug('Results: ' + this.parsedResults.length);

    for (var i in this.parsedResults){
        if(keys.indexOf(this.parsedResults[i].name) == -1){
            keys.push(this.parsedResults[i].name);
            filteredResults.push(this.parsedResults[i]);
        }
    }

    //TODO: Filter Ignored

    this.parsedResults = filteredResults;
    this.logger.debug('Filtered results: ' + this.parsedResults.length);
}

module.exports = Xtractor;