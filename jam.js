function Jam(args) {
    var args = args || {}; 
    this.name = args.name || "no name";
    this.start = args.start ||  null;
    this.end = args.end ||  null;
    this.short = args.short;
    this.w3 = false;
    this.d3 = false;
    this.h3 = false;
}

module.exports = Jam;