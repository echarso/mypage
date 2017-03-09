var d3 = require("d3");
var d3Scale = require("d3-scale");
var PopulationPie  = require("./populationPieChart.js");

if ( document.getElementById("svg1") ){
  drawBar("#svg1");
}else{
  console.log(" svg1 not found ");
}
//drawBar("#tzovenoi");
//drawBar("#kopelies");
if ( document.getElementById("krhth") ){
  drawBar("#krhth");
}else{
  console.log(" krhth not found ");
}

if ( document.getElementById("agoriaKoritsiaGreece") ){
  drawBar("#agoriaKoritsiaGreece");
}else{
  console.log(" agoriaKoritsia not found ");
}

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var z = d3Scale.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var color ={
  "kagkouria":"lightblue",
  "koritsia":"orange"
}

function drawBar( element){



  var svg = d3.select(element),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3Scale.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3Scale.scaleBand()
      .padding(0.05);

  var y = d3Scale.scaleLinear()
      .rangeRound([height, 0]);


var str;
if (element.indexOf("svg1") > -1 ) str =  "areaGreece.csv";
if (element.indexOf("tzovenoi") > -1 ) str =  "tzovenoiGreece.csv"
if (element.indexOf("kopelies") > -1 ) str =  "kopeliesGreece.csv"
if (element.indexOf("krhth") > -1 ) str =  "agoriaKoritsiaCrete.csv"
if (element.indexOf("agoriaKoritsiaGreece") > -1 ) str =  "agoriaKoritsiaGreece.csv"


  d3.csv(str, function(d, i, columns) {
  	console.log(d);
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
  }, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);


    x0.domain(data.map(function(d) { return d.Area; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Area) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("class","barClass")
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) {
          if ( d.key=="kagkouria" || d.key=="koritsia" )  return color[d.key]; 
          else return z(d.key);
        })
		.on("mouseover", function(d) {
		          var dInput = d;
		          div.transition().duration(200).style("opacity", .9);
		          div.html(d.value+ "<br/> auto" + d.key )
		         .style("left", (d3.event.pageX) -5 + "px")
		         .style("top", function(){var place = y(dInput.value);return (d3.event.pageY) +"px";});

		         d3.selectAll(".barClass")
		           //.attr("width",function(d){if( dInput == d){return x1.bandwidth()+2;}return x1.bandwidth();})
		           .attr("fill",function(d){
                if( dInput == d){return "orangered"  ;}
                if ( d.key=="kagkouria" || d.key=="koritsia" )  return color[d.key]; 
                else return z(d.key);
              });

       })
     .on("mouseout", function(d) {
       	div.transition().duration(500).style("opacity", 0);
       	d3.selectAll(".barClass").attr("fill",function(d){
          if ( d.key=="kagkouria" || d.key=="koritsia" )  return color[d.key]; 
          else return z(d.key);
        });
       });
    
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population");


    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}

console.log(" exit bar js");