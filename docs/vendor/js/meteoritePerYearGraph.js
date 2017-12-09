// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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

var	iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%L");

function parseDate(date){
  return iso.parse(date);
}

// set the ranges
var x = d3.scaleBand()
  .range([0, width])
  .padding(0.1);
var y = d3.scaleLinear()
  .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("#meteoritePerYear").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json("datasets/earthMeteoriteLandings.json", function (error, data) {
  if (error) return console.log(error); //unknown error, check the console  

  // format the data
  data.forEach(function (d) {
    console.log(d.year);
    d.year = parseDate(d.year).getFullYear();
    console.log(d.year);
  });

  console.log(data);

  // Scale the range of the data in the domains
  x.domain(data.map(function (d) { return d.salesperson; }));
  y.domain([0, d3.max(data, function (d) { return d.sales; })]);

  // append the rectangles for the bar chart
  svg2.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.salesperson); })
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d.sales); })
    .attr("height", function (d) { return height - y(d.sales); });

  // add the x Axis
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg2.append("g")
    .call(d3.axisLeft(y));

});