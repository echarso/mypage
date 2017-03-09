var d3 = require("d3");
var d3Scale = require("d3-scale");


var svg,width,height,radius,color,arc,labelArc,pie,arcOver;

if ( document.getElementById("aiportTotal2") ){
	createPie("#aiportTotal2");
	drawPie();
}else{
	console.log(" airport2 not found");
}

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var div = d3.select(".texttooltip");

function createPie(element){

	svg = d3.select(element);
	
	width = 600 ;
	height = 600 ;
	radius = Math.min(width/2, height/2)/2;
	color = {
		"Athens":"blue",
		"Heraklion":"orange",
		"Chania":"purple",
		"Thessaloniki":"green"
	}


	arc = d3.arc()
			.outerRadius(radius - 10)
			.innerRadius(20);

	arcOver = d3.arc()
    	  .innerRadius(radius +10)
      	  .outerRadius(45);

	labelArc = d3.arc()
				.outerRadius(radius - 10)
				.innerRadius(radius - 20);

	pie = d3.pie()
			.sort(null)
			.padAngle(0.02)
			.value(function(d) { return d.Passengers; });

	svg = svg.append("g")
			  .attr("transform", "translate(" + width/2  + "," + height/3 + ")");


}


function drawPie(){


	d3.csv("airportTotalPassengers.csv", type, function(error, data) {
	  if (error) throw error;

	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	      .enter().append("g")
	      .attr("class", "arc");

	  	g.append("path")
	      .attr("d", arc)
	      .attr("class","pieClass")
	      .style("fill", function(d) { return color[d.data.Airport]; })
	      .on("mouseover", function(d) {
		          var dInput = d;
		          
		          div.transition().duration(200).style("opacity", .9);

		          div.html("Passengers : " + d.value+"<br>Airport : " +d.data.Airport)
		  			 .style("left", (d3.event.pageX) +10 + "px")
		        	 .style("top", function(){return (d3.event.pageY) +"px";});
		          

		          d3.selectAll(".pieClass")
		            .style("fill",function(d){
              				  if( dInput.data.Airport == d.data.Airport){ 
                 				    return color[d.data.Airport];//return "orangered";
              				   }else{
              				        return color[d.data.Airport];
              				}
	              });

		          d3.select(this).transition()
         				 .duration(1000)
         				 .attr("d", arcOver);

          })
          .on("mouseout", function(d) {
       			div.transition().duration(500).style("opacity", 0);
       			d3.selectAll(".pieClass").style("fill",function(d){	
        		  		return color[d.data.Airport];
        		  		});
       			d3.select(this).transition()
          				.duration(1000)
          				.attr("d", arc);
       });


	  g.append("text")
	      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("fill","black")
	      .text(function(d) {return d.data.Airport + " " + d.data.Passengers; });


	});


}

function type(d) {
  d.Passengers = +d.Passengers;
  return d;
}
