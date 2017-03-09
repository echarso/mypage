var d3 = require("d3");
var d3Scale = require("d3-scale");


var data = [
    ["New York Knicks","Cleveland Cavaliers","88"],
    ["Cleveland Cavaliers","New York Knicks","117"]
];

var countries =["New York Knicks","Cleveland Cavaliers"];
var colors ={"New York Knicks": "white", "Cleveland Cavaliers":"red"};
 
var ch = viz.ch().data(data)
      .padding(.08)
      .sort(sort)
    .innerRadius(210)
    .outerRadius(230)
    .duration(1000)
    .chordOpacity(0.3)
    .labelPadding(.03)
      .fill(function(d){ return colors[d];});

var width=900, height=900;

var svg = d3.select("#chordChart").append("svg").attr("height",height).attr("width",width);
svg.append("g").attr("transform", "translate(400,250)").call(ch);
