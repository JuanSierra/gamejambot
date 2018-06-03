var Datastore = require('nedb');
var Jam = require('./jam.js');

function Lister() {
    //this.bar = bar;
    //this.baz = 'baz'; // default value
    this.jams = {};
    this.db = new Datastore({ filename: 'daba' });
    this.db.loadDatabase(function (err) {
        if(err)
            console.log('Ops. An error: ' + err);
    });
}

Lister.prototype.insertJam = function(newJam) {

    this.db.find({ name: newJam.name }, function (err, docs) {
        console.log('Found '+ newJam.name + ' already');

        return;
    });

    // Notification setup
    var now = new Date();
    var hs = Math.abs(new Date(newJam.start) - now) / 36e5;

    if(new Date(newJam.start) < now)
        return;

    console.log(newJam.name + ' ' +hs+ ' hours')
    // 3 weeks
    if(hs>72 && hs<=504){
        newJam.w3 = true;
    }
    // 3 days
    if(hs>3 && hs<=72){
        newJam.d3 = true;
    }

    this.db.insert(newJam, function (err) {
        if(err)
            console.log('Error inserting ' + newJam.name + ' : ' + err);
      }
    );
};

Lister.prototype.read = function() {
    var db = new Datastore({ filename: 'daba' });

    db.loadDatabase(function (err) {
        console.log('Ops. An error: ' + err);
    });

    var that = this;
    db.find({}, function (err, docs) {
        that.jams = docs;
    });
}

Lister.prototype.updatePeriod = function(name, minHours){
    if(minHours == 504){
        this.db.update({ name: name }, { $set: { w3: true } }, {}, function () {
        });
    }else if(minHours == 72){
        this.db.update({ name: name }, { $set: { d3: true } }, {}, function () {
        });
    }else{
        this.db.update({ name: name }, { $set: { h3: true } }, {}, function () {
        });
    }   
}

//PRE: if weeks is in false it doesnt have a notification at all

Lister.prototype.getByWeeks = function(callb) {
    this.db.find({w3: false}, function (err, docs) {
        callb(docs);
    });
}

Lister.prototype.getByDays = function(callb) {
    this.db.find({w3: true, d3: false}, function (err, docs) {    
        callb(docs);
    });

    console.log('what')
}

Lister.prototype.getByHours = function(callb) {
    this.db.find({w3: true, d3: true, h3: false}, function (err, docs) {
        callb(docs);
    });
}

module.exports = Lister;