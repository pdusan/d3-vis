let svg = d3.select("#bar-container");

let margin = {
  top: 30,
  bottom: 30,
  left: 30,
  right: 30,
};

let width = 1000 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;

let xScale = d3.scaleOrdinal().range([0, width]);
let yScale = d3.scaleLinear().range([0, height]);

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale);

d3.csv("../data/austria_most_visited_places_2018.csv").then((data) => {
  data.forEach((d) => {
    d.Visitors = +d.Visitors;
  });

  const visits = data.map((d) => d.Visitors);

  var min = d3.min(visits);
  var max = d3.max(visits);

  svg
    .selectAll("attractions")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 10)
    .attr("height", 40);
});
