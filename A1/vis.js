let svg = d3.select("#bar-container");

let dims = {
  //define dimensions for margins and bar width
  top: 30,
  bottom: 30,
  left: 45,
  right: 100,
  band: 50,
};

let width = //get the width and height of the svg, adjusted for margins
  document.getElementById("bar-container").clientWidth - dims.left - dims.right;
let height =
  document.getElementById("bar-container").clientHeight -
  dims.top -
  dims.bottom;

let xScale = d3.scaleBand().range([width - dims.left - dims.right, 0]); //define the axes and their range
let yScale = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(xScale);
let yAxis = d3.axisLeft().scale(yScale);

let elements = svg //an extra element added to svg to hold axes and bars, used for moving the chard
  .append("g") //to make space for the axis labels which are placed in the next few lines
  .attr("transform", "translate(" + dims.right + ", 0)");

svg
  .append("text")
  .text("Tourist attractions")
  .attr("x", width / 2)
  .attr("y", height + dims.bottom);

svg
  .append("text")
  .text("Number of visitors")
  .attr("x", 0)
  .attr("y", height / 2);

d3.csv("../data/austria_most_visited_places_2018.csv").then((data) => {
  //loading and adjusting the data
  data.forEach((d) => {
    d.Visitors = +d.Visitors;
  });

  const visits = data.map((d) => d.Visitors);
  const places = data.map((d) => d.Place);

  var min = d3.min(visits);
  var max = d3.max(visits);

  yScale.domain([0, max + min]); //setting the axis domains (domain of y set to min+max, to allow for better result visibility)
  xScale.domain(places);

  elements //placing all the elements onto the svg
    .append("g")
    .call(yAxis)
    .attr("class", "axis")
    .attr("transform", "translate(" + dims.right + ", 0)");

  elements
    .append("g")
    .call(xAxis)
    .attr("class", "axis")
    .attr("transform", "translate(" + dims.right + ", " + height + ")");

  elements
    .selectAll("attractions")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.Place) + dims.right + dims.left)
    .attr("y", (d) => yScale(d.Visitors))
    .attr("width", dims.band)
    .attr("height", (d) => height - yScale(d.Visitors));
});
