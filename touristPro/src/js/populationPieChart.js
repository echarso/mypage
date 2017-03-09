var d3 = require("d3");
var d3Scale = require("d3-scale");


var svg,width,height,radius,color,arc,labelArc,pie;


var elementExists = document.getElementById("aiportTotal2");
if ( elementExists ) {
	console.log("mphka sto " + aiportTotal2);
	createPie("#aiportTotal2");
	drawPie();	
}

var elementExists = document.getElementById("aiportTotal");
if ( elementExists ) {
	console.log("mphka sto aiportTotal" );
	createPie("#aiportTotal");
	drawPie();	
}



function createPie(element){

	svg = d3.select(element);
	console.log( element);
	console.log( svg );	
	if ( !svg.attr("width") ){ 
		console.log(" -1 for " + element);
		return -1;
	}
	width = 400 ;
	height = 400 ;
	radius = Math.min(width, height) / 2;
	color = d3Scale.scaleOrdinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


	arc = d3.arc().outerRadius(radius - 10).innerRadius(20);
	labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 20);
	pie = d3.pie().sort(null).value(function(d) { return d.Passengers; });

	svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	return 0 ;
}


function drawPie(){

	console.log(" drawin h ");

	d3.csv("airportTotalPassengers.csv", type, function(error, data) {
	  if (error) throw error;

	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	      .enter().append("g")
	      .attr("class", "arc");

console.log(" drawin h ");


	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { 
	      	console.log("  color " +d.data.Airport ) ; 
	      	return color(d.data.Airport); });

console.log(" drawin h ");

	  g.append("text")
	      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .text(function(d) { 
	      					return d.data.Airport + " " + d.data.Passengers; });
	});

}

function type(d) {
  d.Passengers = +d.Passengers;
  return d;
}