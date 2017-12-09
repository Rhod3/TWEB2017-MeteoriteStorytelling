//Map dimensions (in pixels)
var width = 1000,
    height = 650;

//Map projection
var projection = d3.geoRobinson()
    .scale(190)
    .center([-0.0018057527730208495, 11.258678472759547]) //projection center
    .translate([width / 2, height / 2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("#meteoriteMap").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("display", "block")
    .attr("margin", "auto");

//Group for the map features
var features = svg.append("g")
    .attr("class", "features");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([0, 1])
    .range(d3.range(7).map(function (i) { return "q" + i + "-7"; }));

//Create a tooltip, hidden at the start
// var tooltip = d3.select("body").append("div").attr("class", "tooltip");

//Keeps track of currently zoomed feature
var centered;

d3.json("datasets/countries.topojson", function (error, geodata) {
    if (error) return console.log(error); //unknown error, check the console

    //Create a path for each map feature in the data
    features.selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.subunits).features) //generate features from TopoJSON
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function (d) { return (typeof color(d.properties.name) == "string" ? color(d.properties.name) : ""); });
        //.on("mouseover", showTooltip)
        //.on("mousemove", moveTooltip)
        //.on("mouseout", hideTooltip)
        //.on("click", clicked);
});

var circles;

// Define the div for the tooltip
var div = d3.select("#meteoriteMap").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("datasets/earthMeteoriteLandings.json", function (error, data) {
    if (error) return console.log(error); //unknown error, check the console

    var extent = d3.extent(data, (d) => {
        return +d.mass;
    })

    var rscale = d3.scale.pow()
        .domain([extent[0], extent[1]])
        .range([3, 20])

    // add circles to svg
    circles = svg.selectAll("circle")
        .data(data).enter()
        .append("circle")
        .attr("cx", (d) => {
            if (d.geolocation !== undefined) {
                return projection(d.geolocation.coordinates)[0];
            } else {
                return 0;
            }
        })
        .attr("cy", (d) => {
            if (d.geolocation !== undefined) {
                return projection(d.geolocation.coordinates)[1];
            } else {
                return 0;
            }
        })
        .attr("r", (d) => {
            if (d.geolocation !== undefined) {
                return rscale(+d.mass);
            } else {
                return 0;
            }
        })
        .attr("fill", "red")
        .on("mouseover", (d) => {
            div.transition()
                .duration(20)
                .style("opacity", .9);
            div.html("Year " + new Date(d.year).getFullYear() + "<br/>" + d.mass + " kg")
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(50)
                .style("opacity", 0);
        });

    /*
    //create zoom handler 
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);
    
    //specify what to do when zoom event listener is triggered 
    function zoom_actions() {
        circles.attr("transform", d3.event.transform);
    }
    
    //add zoom behaviour to the svg element 
    //same as svg.call(zoom_handler); 
    zoom_handler(svg);
    */

    // Zoom to feature on click
    function clicked(d, i) {

        //Add any other onClick events here

        var x, y, k;

        if (d && centered !== d) {
            // Compute the new map center and scale to zoom to
            var centroid = path.centroid(d);
            var b = path.bounds(d);
            x = centroid[0];
            y = centroid[1];
            k = .8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
            centered = d
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }

        // Highlight the new feature
        features.selectAll("path")
            .classed("highlighted", function (d) {
                return d === centered;
            })
            .style("stroke-width", 1 / k + "px"); // Keep the border width constant

        //Zoom and re-center the map
        //Uncomment .transition() and .duration() to make zoom gradual
        features
            .transition()
            .duration(500)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    }


    //Position of the tooltip relative to the cursor
    var tooltipOffset = { x: 5, y: -25 };

    //Create a tooltip, hidden at the start
    function showTooltip(d) {
        moveTooltip();

        tooltip.style("display", "block")
            .text(d.properties.name);
    }

    //Move the tooltip to track the mouse
    function moveTooltip() {
        tooltip.style("top", (d3.event.pageY + tooltipOffset.y) + "px")
            .style("left", (d3.event.pageX + tooltipOffset.x) + "px");
    }

    //Create a tooltip, hidden at the start
    function hideTooltip() {
        tooltip.style("display", "none");
    }
})
