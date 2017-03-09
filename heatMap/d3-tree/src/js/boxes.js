
var d3 = require('d3');

var margin = {
    top: 20,
    right: 150,
    bottom: 20,
    left: 150
},
width = 560 - margin.right - margin.left,
height = 2000 - margin.top - margin.bottom;

var root = {
    "name": "HEAD ORG",
    "size":15000,
        "children": [{
        "name": "PM 1 OFFICE",
        "size":70,
            "children": [{
            "name": "MAIN DEV UNIT",
            "size":6000,
            "children": [{
                        "name": "SUB PM1",
                        "size": 3938,
                        "children":[{
                            "name": "SUB PM2",
                            "size":8971
                        }
                        ]
                    }, {
                        "name": "SUB PM2",
                          "size": 3812
                    }, {
                        "name": "ProductA114",
                            "size": 6714
                    }, {
                        "name": "ProductA115",
                        "size": 7438,
                        "children":[{
                            "name": "SUB PM2",
                            "size":8971}
                        ]
            }]
        }, {
            "name": "ProductA12",
            "size":223,
                "children": [{
                "name": "ProductA121",
                    "size": 3534
            }, {
                "name": "ProductA122",
                    "size": 5731
            }, {
                "name": "ProductA123",
                    "size": 7840
            }, {
                "name": "ProductA124",
                    "size": 5914
            }, {
                "name": "ProductA125",
                    "size": 3416
            }]
        }, {
            "name": "ProductA13",
            "size":123,
                "children": [{
                "name": "ProductA131",
                    "size": 7074
            }]
        }]
    }, {
        "name": "ProductA2",
         "size":3232,
            "children": [{
            "name": "ProductA21",
                "size": 17010
        }]
    } ]
};

  var i = 0,
    duration = 750,
    rectW = 80,
    rectH = 30;

var colours = [ "#44d7a8","#2ed19c","#f2e796","#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364","#fc3f41","#f93e30"];
//var colours = [ "#FF7363", "#FF6364"];

var heatmapColour = d3.scale.linear()
  .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
  .range(colours);


// dynamic bit...


// here we define the space between the nodes 
var tree = d3.layout.tree().nodeSize([90, 80]);
var nodes = tree.nodes(root).reverse();
var array =[];
for ( var i = 0; i < nodes.length ; i++){
    if ( nodes[i] && nodes[i].size > 0 ) 
                array.push(nodes[i].size);
}

console.log(array);
var c = d3.scale.linear().domain(d3.extent(array)).range([0,1]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) {
    return [d.x + rectW / 2, d.y + rectH / 2];
});

var svg = d3.select("#body").append("svg").attr("width", 1300).attr("height", 1900)
    .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
    .attr("transform", "translate(" + 850 + "," + 10 + ")");

//necessary so that zoom knows where to zoom and unzoom from
zm.translate([350, 20]);

root.x0 = 0;
root.y0 = height / 2;

function collapse(d) {
    if (d.children) {
        d.children = d.children;
        d.children.forEach(collapse);
        d._children = null;
    }
}

root.children.forEach(collapse);
update(root);


function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    var nodeNumber = 0 ;
    var currentDepth = 0 ;
    
    nodes.forEach(function (d) {
        d.y = d.depth * 110;
       /* if(currentDepth ==d.depth ){
                    nodeNumber ++;
                    var num =  d.y + 10*nodeNumber;
                    console.log(" num " + num);
                    d.y =  num;
        }else{
                    nodeNumber = 0;
                    var num =  d.y + 10*nodeNumber;
                    console.log(" intitial num " + num);
                    currentDepth = d.depth;
                    d.y  = num;
        }*/
    });

    // Update the nodesâ€¦
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) {
        return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeNumber =1;
    var currentDepth=1;
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
    }).on("click", click);

    nodeEnter.append("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
                if (d.size >0 ){
                    return heatmapColour(c(d.size));
                }
             return d._children ? "lightsteelblue" : "#fff";
    });

    nodeEnter.append("text")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
        return d.name;
    });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    nodeUpdate.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
                        return heatmapColour(c(d.size));

        return d._children ? "lightsteelblue" : "#fff";
    });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + source.x + "," + source.y + ")";
    })
        .remove();

    nodeExit.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
    .attr("stroke", "black")
        .attr("stroke-width", 1);

    nodeExit.select("text");

    // Update the linksâ€¦
    var link = svg.selectAll("path.link")
        .data(links, function (d) {
        return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("d", function (d) {
        var o = {
            x: source.x0,
            y: source.y0
        };
        return diagonal({
            source: o,
            target: o
        });
    });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
        var o = {
            x: source.x,
            y: source.y
        };
        return diagonal({
            source: o,
            target: o
        });
    })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

//Redraw for zoom
function redraw() {
  //console.log("here", d3.event.translate, d3.event.scale);
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}
