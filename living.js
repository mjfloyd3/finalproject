(function() {
  // create the svg

var margin = {top: 25, right: 0, bottom: 30, left: 60},
    width = 930 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set x scale
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.15)
    .align(0.1);

// set y scale
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// set the colors
var z = d3.scaleOrdinal()
    .range(["#345995", "#03CEA4"]);


var svgb = d3.select("#stacked").append("svg")
    .attr("width", width + margin.left + margin.right + 80)
    .attr("height", height + margin.top + margin.bottom);
    g = svgb.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the csv and create the chart
d3.csv("living.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);


  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.year); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop() + 0.5))
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 25 +")"; });

  legend.append("rect")
      .attr("x", width - 25)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 70)
      .attr("y", 10)
      .attr("dy", "0.40em")
      .text(function(d) { return d; });
});

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svgb.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 30)
    .attr("fill", "white")
    .style("opacity", .7);

  tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold");

})();
