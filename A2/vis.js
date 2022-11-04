let svg = d3.select("#lines-container");

let dims = {
  //define dimensions for margins and bar width
  top: 30,
  bottom: 30,
  left: 45,
  right: 135,
};

let width = //get the width and height of the svg, adjusted for margins
  document.getElementById("lines-container").clientWidth -
  dims.left -
  dims.right;
let height =
  document.getElementById("lines-container").clientHeight -
  dims.top -
  dims.bottom;

let xScale = d3.scaleLinear().range([width - dims.left - dims.right, 0]); //define the axes and their range
let yScale = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(xScale).ticks(40).tickFormat(d3.format("d"));
let yAxis = d3.axisLeft().scale(yScale);

let elements = svg //an extra element added to svg to hold axes and bars, used for moving the chard
  .append("g") //to make space for the axis labels which are placed in the next few lines
  .attr("transform", "translate(" + dims.right + ", 0)");

svg
  .append("text")
  .text("Years")
  .attr("x", width / 2 + dims.right)
  .attr("y", height + dims.bottom + dims.top);

svg
  .append("text")
  .text("Fertility Rate (Births per Woman)")
  .attr("x", 0)
  .attr("y", height / 2);

//Temporary highlight
function highlightTemp(event, d) {
  d3.select("#lines-container")
    .append("text")
    .text(d.country)
    .attr("x", width - dims.right)
    .attr("y", height - dims.top)
    .attr("class", "country-label")
    .attr("id", "country");
  d3.select("#line_" + d.country.replace(/ /g, "")).attr("class", "selected");
  d3.selectAll(".line").attr("class", "hidden");
}

//Permanent highlight
var oldLine = null;
function highlightPerm(event, d) {
  d3.select("#country-perm").remove();
  d3.select("#clicked-line").attr("id", oldLine).attr("class", "line");

  d3.select("#lines-container")
    .append("text")
    .text(d.country)
    .attr("x", dims.right + dims.left)
    .attr("y", height - dims.top)
    .attr("class", "country-label")
    .attr("id", "country-perm");
  d3.select("#line_" + d.country.replace(/ /g, ""))
    .attr("class", "selected")
    .attr("id", "clicked-line");
  d3.selectAll(".line").attr("class", "hidden");
  oldLine = "line_" + d.state.replace(/ /g, "");
}

//Unhighlight
function deselect(event, d) {
  d3.select("#country").remove();
  d3.select("#line_" + d.country.replace(/ /g, "")).attr("class", "line");
  d3.selectAll(".hidden").attr("class", "line");
}

d3.csv("world_fertility_rate_1960_2020.csv").then((data) => {
  //loading and adjusting the data

  var col = data.columns.slice(2); //used to iterate through all the items in the dataset for conversion
  data.forEach((d) => {
    col.forEach((c) => {
      d[c] = +d[c];
    });
  });

  var minFertility = d3.min(col, (c) => d3.min(data, (d) => d[c]));
  var maxFertility = d3.max(col, (c) => d3.max(data, (d) => d[c]));

  yScale.domain([0, maxFertility + minFertility]); //setting the axis domains (domain of y set to min+max, to allow for better result visibility)
  xScale.domain([d3.max(col), d3.min(col)]);

  var grouped = d3.group(data, (d) => d["Country Name"]); // Transforming the data for line plotting        TODO
  var betterData = [];
  Array.from(grouped.keys()).forEach((d) => {
    item = {};
    item.country = d;
    item.values = [];
    col.forEach((c) => {
      entry = {};
      entry.year = c;
      entry.fertility = grouped.get(d)[0][c];
      item.values.push(entry);
    });
    betterData.push(item);
  });
  console.log(data);

  let line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.fertility));

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
    .selectAll("ferts")
    .data(betterData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .attr("fill", "none")
    .attr("transform", "translate(" + dims.right + ", 0)")
    .attr("id", (d) => "line_" + d.country.replace(/ /g, ""))
    .on("mouseover", highlightTemp)
    .on("mouseout", deselect)
    .on("mousedown", highlightPerm);
});
