// d3 LineChart
// be carefull with the date format


var d3 = require('d3');
var d3LineChart = {};
var svg;
var g;

var x;
var y;
var z;
var parseTime;
var line;
var width;
var height;

d3LineChart.create= function(el,props, state) {


console.log( " calling create for Line  Chart " );

svg = d3.select("svg");

var margin = {top: 20, right: 80, bottom: 30, left: 50};
width = props.width - margin.left - margin.right;
height = props.height - margin.top - margin.bottom;

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

parseTime = d3.timeParse("%Y%m%d");

x = d3.scaleTime().range([0, width]);
y = d3.scaleLinear().range([height, 0]);
z = d3.scaleOrdinal(d3.schemeCategory10);

line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {  return x(d.date); })
    .y(function(d) { return y(d.money); });

 this.update(el, state);
 //highway();
}



d3LineChart.update =  function(el, state) {


console.log( " calling update for line Chart ");

console.log( " calling update for line Chart line  " + line );


  var data = state.barData;

  var moneyGroups = state.colorKeys;

  var keys = moneyGroups.map(function(id) {
   

    return {
      id: id,
      values: data.map(function(d) {
        d.date = d.date.replace(/-/g,"");
        return {date: parseTime(d.date), money: d[id]};
      })
    };
  });




  x.domain(d3.extent(data, function(d) {  d.date = d.date.replace(/-/g,"");
                                          return parseTime(d.date);
                                        }));

  y.domain([
    d3.min(keys, function(c) { return d3.min(c.values, function(d) { return d.money; }); }),
    d3.max(keys, function(c) { return d3.max(c.values, function(d) { return d.money; }); })
  ]);

  z.domain(keys.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Amount of Money , SEK");



  var lineKey = g.selectAll(".lineKey")
    .data(keys)
    .enter().append("g")
      .attr("class", "lineKey");

  lineKey.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
      	return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });


  lineKey.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.money) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) {  return d.id.substring(0,5); });



}// end of update


d3LineChart.destroy =  function(el, state) {

console.log(" line chart burned with fire ");

}
var highway = function (){


d3.tsv("data.tsv", type, function(error, data) {
  if (error) throw error;

// console.log( data );
  //alert(" ok ");

  var cities = data.columns.slice(1).map(function(id) {

    return {
      id: id,
      values: data.map(function(d) {

        return {date: d.date, temperature: d[id]};
      })
    };
  });


 //console.log( cities );

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºF");

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });

  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) {
           return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
       })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

}

function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

module.exports = d3LineChart;