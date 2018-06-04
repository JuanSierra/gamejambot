const BODY_OPEN = '<html><body>';
const BODY_CLOSE = '</body></html>';

var request = require('request');
var cheerio = require('cheerio');
var Jam = require('./jam.js');

var Extrator = require("html-extractor");
var myExtrator = new Extrator();

var Lister = require('./lister.js');

function Xtractor() {
    this.parsedResults = [];
    this.lister = new Lister();
}

Xtractor.prototype.getData = function(){
    var that = this;
    console.log('Getting data...');

    request('https://itch.io/jams', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
    
            $('.jam_cell span a').each( function(i, element){
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

        return callb();
    });

    function callb (){
        var name, start, end, short;
        var lister = new Lister();
        
        that.parsedResults.forEach(function(element){
            request('https://itch.io' + element.url, function (error, response, html) {
                //console.log('https://itch.io' + element.url)
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

                        lister.insertJam( new Jam(
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

module.exports = Xtractor;