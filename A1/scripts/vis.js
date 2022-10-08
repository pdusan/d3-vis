let svg = d3.select("#bar-container");

let margin = {
  top: 30,
  bottom: 30,
  left: 0,
  right: 30,
};

let width =
  document.getElementById("bar-container").clientWidth -
  margin.left -
  margin.right;
let height =
  document.getElementById("bar-container").clientHeight -
  margin.top -
  margin.bottom;

let xScale = d3.scaleBand().range([width + 50, 0]);
let yScale = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale);

d3.csv("../data/austria_most_visited_places_2018.csv").then((data) => {
  data.forEach((d) => {
    d.Visitors = +d.Visitors;
  });

  const visits = data.map((d) => d.Visitors);
  const places = data.map((d) => d.Place);

  var min = d3.min(visits);
  var max = d3.max(visits);

  yScale.domain([0, max]);
  xScale.domain(places);
  xScale.bandwidth(50);

  svg.append("g").call(yAxis).attr("transform", "translate(100, 0)");

  svg
    .append("g")
    .call(xAxis)
    .attr("transform", "translate(100, " + height + ")");

  svg
    .selectAll("attractions")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.Place) + 160)
    .attr("y", (d) => height - yScale(d.Visitors))
    .attr("width", 50)
    .attr("height", (d) => yScale(d.Visitors));
});
