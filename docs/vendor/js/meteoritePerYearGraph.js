// set the dimensions and margins of the graph
var width2 = 1000,
  height2 = 500;

function sortNumber(a, b) {
  return a - b;
}

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

var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%L");

// get the data
d3.json("datasets/earthMeteoriteLandings.json", function (error, data) {
  if (error) return console.log("datasets/earthMeteoriteLandings.json" + error); //unknown error, check the console  

  var date = [];
  var test = 0;
  console.log("length of the data : " + data.length);
  // format the data
  data.forEach(function (d) {
    test++;
    if (d.year != undefined) {
      d.year = iso.parse(d.year);
      d.year = d.year.getFullYear();
      date.push(d.year);
    }
  });


  date = date.sort(sortNumber);
  console.log(date);
  var [a, b] = count(date);
  a = a.sort(sortNumber);

  var histogram = d3.layout.histogram()
    .bins(a)(date);

  console.log(histogram);


  console.log(a);
  console.log(b);
  console.log(width2);
  console.log(a.length);
  console.log([0, d3.max(histogram.map(function (d) { return d.length; }))]);

  // Scale the range of the data in the domains
  //var x.domain(a);
  // y.domain([0, d3.max(histogram.map(function (d) { return d.length; }))]);



  var x = d3.scale.linear()
    .domain([d3.min(date), d3.max(date)])
    .range([0, width2 - 20]);

  var y = d3.scale.linear()
    .domain([0, d3.max(histogram, function (i) { return i.length; })])
    .range([0, height2]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg2 = d3.select("#meteoritePerYear").append("svg")
    .attr("width", width2)
    .attr("height", height2);

  // append the rectangles for the bar chart
  var bars2 = svg2.selectAll(".bar")
    .data(histogram)
    .enter()
    .append("g");

  bars2.append("rect")
    .attr("x", function (d) { return x(d.x); })
    .attr("y", function (d) { return height2 - 20 - y(d.y); })
    .attr("width", 3)
    .attr("height", function (d) { return y(d.y); })
    .attr("fill", "darkblue");

  //svg2.append("g")
  //  .attr("transform", "translate(0," + height + ")")
  //  .call(d3.axisBottom(x));

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height2 - 20) + ")")
    .call(xAxis);

  svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis);
});
