//// data copied from 
///   http://vallandingham.me/bubble_chart_v4/src/bubble_chart.js
// http://vallandingham.me/bubble_chart_v4/#

/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

function bubbleChart() {
  // Constants for sizing
  var width = 500;
  var height = 650;
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height /2.8 };

  var yearCenters = {
    "Eastern Conference": { x: 210, y: height/2.8  },
    "Western Conference": { x: width/1.5, y: height/2.8  }
  };

  var nodeOneBubbleCenter ={
      "Eastern Conference": { x: width/2, y: 140  },
      "Western Conference": { x: width/2, y: 140   } ,
      "selected": { x: width/2, y: height/3  }
  };

  // X locations of the year titles.
  var yearsTitleX = {
    "Eastern Conference": 120,
    "Western Conference": width -150
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.2;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var bubbleImage = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);
    //.on('end',ended);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium', 'high'])
    .range(['#d84b2a', '#beccae', '#7aa25c']);


  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    var maxAmount = d3.max(rawData, function (d) { return +d.total_amount; });
    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 40])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.total_amount),
        value: +d.total_amount,
        name: d.grant_title,
        org: d.organization,
        group: d.group,
        year: d.organization,
        url:d.url,
        x: Math.random() * 500,
        y: Math.random() * 400
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }


  var bublesG;
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

     bublesG = bubbles.enter()
     		 .append("g");

  var bubblesE = bublesG
      .append('circle')
        .attr('r', function(d) {return d.radius;})
        .attr('fill', function (d) { return "white";})//return fillColor(d.group); })
        .attr('stroke', function (d) { return "grey";})//return d3.rgb(fillColor(d.group)).darker(); })
        .attr('stroke-width', 2)
        .on('click',mouseclick)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    bubbleImage =  bublesG.append("svg:image")
        .attr("width", function(d) { return d.radius*1.3;})
        .attr("height", function(d) {return d.radius*1.3;})
        .attr("xlink:href",  function(d) { return d.url;})
        .on('click',mouseclick)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail);
       //.attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; };
          
    simulation.nodes(nodes);
    // Set initial layout to single group.
    groupBubbles();
  };

 
  function ticked() {
     bubbles.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
     bubbleImage.attr("transform", function(d) { return "translate(" + (d.x-(d.radius/1.5)) + ","+ (d.y-(d.radius/1.3)) + ")"; });
  }

  
  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  function nodeYearPosX(d) {
      console.log("d.id " + d.id);
      return yearCenters[d.year].x;
  }

   function nodeYearPosY(d) {
    // we return positioin with respect to the current nba record placement
    return yearCenters[d.year].y;
  }

   function nodeOneBubblePosX(d) {
      if ( d.selected == "true") return nodeOneBubbleCenter["selected"].x;
      return 100+(2*d.radius)+6*d.id;
  }
   function nodeOneBubblePosY(d) {
      if ( d.selected == "true") return nodeOneBubbleCenter["selected"].y;
      return nodeOneBubbleCenter[d.year].y;
  }
  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideYearTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  var conferenceMode = false;
  function splitBubbles() {
    showYearTitles();
    conferenceMode = true;
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPosX));
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeYearPosY));
    simulation.alpha(1).restart();
  }

  /*
   * Hides Year title displays.
   */
  function hideYearTitles() {
    conferenceMode = false;
    svg.selectAll('.year').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showYearTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<img src='+d.url +' height=\"42\" width=\"42\"/>'+
                  '<span class="name">Title: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Amount: </span><span class="value">$' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">Year: </span><span class="value">' +
                  d.year +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    // not to shown 
    d.selected ="false";
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'year') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };

  function mouseclick(d){
    d.selected="true";
    selectBubble();
 }


  function selectBubble(){
    // hiding the conference titles in case they were visible
    hideYearTitles();

//       if ( conferenceMode == true ){
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeOneBubblePosX));
  //     }
       simulation.force('y', d3.forceY().strength(forceStrength).y(nodeOneBubblePosY));
       simulation.alpha(1).restart();
   }

  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('gates_money.csv', display);

// setup the buttons.
setupButtons();