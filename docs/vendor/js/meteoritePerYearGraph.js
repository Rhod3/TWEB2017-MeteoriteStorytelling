// set the dimensions and margins of the graph
var margin = { top: 30, right: 50, bottom: 30, left: 50 },
  width2 = 1200 - margin.left - margin.right,
  height2 = 600 - margin.top - margin.bottom;

// Function to sort numbers
function sortNumber(a, b) {
  return a - b;
}

// Function to count the occurrences / frequency of array elements
function count(arr) {
  var a = [], b = [], prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  return [a, b];
}

// parse the date in an utc format
var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%L");

// get the data
d3.json("datasets/earthMeteoriteLandings.json", function (error, data) {
  if (error) return console.log("datasets/earthMeteoriteLandings.json" + error); //unknown error, check the console  

  var date = [];
  //console.log("length of the data : " + data.length);

  // format the data
  data.forEach(function (d) {
    // There might have some comets without any year
    if (d.year != undefined) {
      d.year = iso.parse(d.year);
      d.year = d.year.getFullYear();
      date.push(d.year);
    }
  });

  // We sort the date
  date = date.sort(sortNumber);
  //console.log(date);
  var [a, b] = count(date);
  a = a.sort(sortNumber);

  // set the parameters for the histogram
  var histogram = d3.layout.histogram()
    .bins(a)(date); // We want each date to be a bin

  //console.log(histogram);
  //console.log(a);
  //console.log(b);
  //console.log(width2);
  //console.log(a.length);
  //console.log([0, d3.max(histogram.map(function (d) { return d.length; }))]);

  
  var x = d3.scale.linear()
    .domain([d3.min(date), d3.max(date)]) // set the ranges
    .range([0, width2]); // Scale the range of the data in the domains

  var y = d3.scale.linear()
    .domain([0, d3.max(histogram, function (i) { return i.length; })]) // set the ranges
    .range([height2, 0]); // Scale the range of the data in the domains

  // append the svg object to the meteoritePerYear id of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg2 = d3.select("#meteoritePerYear").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

  // Creation of the bar for the histogram
  var bars2 = svg2.selectAll(".bar")
    .data(histogram)
    .enter()
    .append("g");

  // append the rectangles for the bar chart
  bars2.append("rect")
    .attr("x", function (d) { return x(d.x); })
    .attr("y", function (d) { return y(d.y); })
    .attr("width", width2/a.length)
    .attr("height", function (d) { return height2 - y(d.y); })
    .attr("fill", "darkblue") // Nice color
    .on("mouseover", (d) => {
      div.transition()
        .duration(20)
        .style("opacity", .9);
      div.html(d.y + " fall(s) in " + d.x)
        .style("left", (d3.event.pageX) + 10 + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      div.transition()
        .duration(50)
        .style("opacity", 0)
        .style("left", 0)
        .style("top", 0);
    });

  // Creation of the x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom"); // the text is at the bottom

  var yAxis = d3.svg.axis()
    .scale(y) // Creation of the x axis
    .orient("left") // the text is at the bottom
    .innerTickSize(-width2) // To show the lines
    .outerTickSize(0);

  // add the x Axis
  svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")") // we have to translate it so he is not in the top of the graph
    .call(xAxis);

  // add the y Axis
  svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis);
});
