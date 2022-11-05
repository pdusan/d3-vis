var svg = d3.select("#lines-container");
var brush = d3.select("#brush-container");

var dims = {
  //define dimensions for margins and bar width
  top: 30,
  bottom: 30,
  left: 45,
  right: 135,
};

var width = //get the width and height of the svg, adjusted for margins
  document.getElementById("lines-container").clientWidth -
  dims.left -
  dims.right;
var height =
  document.getElementById("lines-container").clientHeight -
  dims.top -
  dims.bottom;

var xScale = d3.scaleLinear().range([width - dims.left - dims.right, 0]); //define the axes and their range
var yScale = d3.scaleLinear().range([height, 0]);
var yBrush = d3.scaleLinear().range([height / 3, 0]);

var xAxis = d3.axisBottom().scale(xScale).ticks(40).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft().scale(yScale);

var doBrush = d3.brushX().extent([
  //Define the brushing extent
  [0, 0],
  [width - dims.left - dims.right, height / 3],
]);

var brushableArea = brush
  .append("g")
  .attr("transform", "translate(" + dims.right + ", 0)"); //define container for brush-related elements, same as elements for svg below

brushableArea
  .append("g")
  .attr("class", "brush")
  .attr("transform", "translate(" + dims.right + ", 0)")
  .call(doBrush);

var elements = svg //an extra element added to svg to hold axes and bars, used for moving the chart
  .append("g") //to make space for the axis labels which are placed in the next few lines
  .attr("transform", "translate(" + dims.right + ", 0)");

svg
  .append("text")
  .text("Years")
  .attr("x", width / 2 + dims.right)
  .attr("y", height + dims.bottom + dims.top);

svg
  .append("text")
  .text("Fertility Rate")
  .attr("x", 0)
  .attr("y", height / 2);
svg
  .append("text")
  .text("(Births per Woman)")
  .attr("x", 0)
  .attr("y", height / 1.85);

elements //Setting up clip path to cut off excess lines after transitioning focus
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width - dims.left - dims.right)
  .attr("height", height)
  .attr("transform", "translate(" + dims.right + ", 0)");

elements
  .append("g")
  .attr("clip-path", "url(#clip)")
  .attr("id", "clipped-chart")
  .append("rect")
  .attr("width", width - dims.left - dims.right)
  .attr("height", height)
  .attr("fill", "white")
  .attr("transform", "translate(" + dims.right + ", 0)");

//Temporary highlight
function highlightTemp(event, d) {
  d3.select("#lines-container")
    .append("text")
    .text(d.country)
    .attr("x", dims.right)
    .attr("y", yScale(d.values[0].fertility))
    .attr("class", "country-label")
    .attr("id", "country");
  d3.select(
    "#line_" +
      d.country
        .replace(/ /g, "")
        .replaceAll(".", "DOT")
        .replace(/[()']/g, "PER")
  ).attr("class", "selected");
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
    .attr("x", dims.right)
    .attr("y", yScale(d.values[0].fertility))
    .attr("class", "country-label")
    .attr("id", "country-perm");
  d3.select(
    "#line_" +
      d.country
        .replace(/ /g, "")
        .replaceAll(".", "DOT")
        .replace(/[()']/g, "PER")
  )
    .attr("class", "selected")
    .attr("id", "clicked-line");
  d3.selectAll(".line").attr("class", "hidden");
  oldLine =
    "line_" +
    d.country.replace(/ /g, "").replaceAll(".", "DOT").replace(/[()']/g, "PER");
}

//Unhighlight
function deselect(event, d) {
  d3.select("#country").remove();
  d3.select(
    "#line_" +
      d.country
        .replace(/ /g, "")
        .replaceAll(".", "DOT")
        .replace(/[()']/g, "PER")
  ).attr("class", "line");
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
  yBrush.domain([0, maxFertility + minFertility]);

  var grouped = d3.group(data, (d) => d["Country Name"]); // Transforming data into a different ibject more suitable for line plotting
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

  var line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.fertility));

  var lineBrushed = d3 //Lines drawn in brushable area
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yBrush(d.fertility));

  elements //placing all the elements onto the svg
    .append("g")
    .call(yAxis)
    .attr("class", "axis")
    .attr("transform", "translate(" + dims.right + ", 0)");

  var transitionAxis = elements //named variable used for transitioning when selecting an area to zoom into
    .append("g")
    .call(xAxis)
    .attr("class", "axis")
    .attr("transform", "translate(" + dims.right + ", " + height + ")");

  elements
    .select("#clipped-chart")
    .selectAll("ferts")
    .data(betterData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .attr("fill", "none")
    .attr("transform", "translate(" + dims.right + ", 0)")
    .attr(
      "id",
      (d) =>
        "line_" +
        d.country
          .replace(/ /g, "")
          .replaceAll(".", "DOT")
          .replace(/[()']/g, "PER")
    )
    .on("mouseover", highlightTemp)
    .on("mouseout", deselect)
    .on("mousedown", highlightPerm);

  brushableArea
    .selectAll("brushed")
    .data(betterData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("transform", "translate(" + dims.right + ", 0)")
    .attr("d", (d) => lineBrushed(d.values))
    .attr("fill", "none");

  brushableArea
    .append("g")
    .call(xAxis)
    .attr("class", "axis")
    .attr("transform", "translate(" + dims.right + ", " + height / 3 + ")");

  //focus brushed area

  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  function focus(event) {
    let extent = event.selection;

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
      xScale.domain([d3.max(col), d3.min(col)]);
      xAxis.ticks(40);
    } else {
      xAxis.ticks(40);
      xScale.domain([xScale.invert(extent[1]), xScale.invert(extent[0])]);
      xAxis.ticks(
        Math.floor(xScale.domain()[0]) - Math.floor(xScale.domain()[1]) //display only the relevant ticks
      );
      brushableArea.select(".brush").call(doBrush.move, null);
    }
    transitionAxis.transition().duration(500).call(xAxis);

    elements.selectAll(".line").attr("d", (d) => line(d.values));
    elements.selectAll(".selected").attr("d", (d) => line(d.values));
  }

  doBrush.on("end", focus);
});
