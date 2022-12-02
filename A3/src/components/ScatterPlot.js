import { useCallback, useContext, useEffect, useState } from "react";
import { dimsContext } from "./App";
import * as d3 from "d3";

export default function ScatterPlot({ data, setX, setY, setScatterLoaded }) {
  const globals = useContext(dimsContext);
  const [loaded, setLoaded] = useState(false);

  let width = 800 - globals.dims.left - globals.dims.right;

  let height = 500 - globals.dims.bot - globals.dims.top;

  let xAxis = d3
    .scaleLinear()
    .domain([0, globals.abs.burgMax + globals.abs.burgMin])
    .range([0, width]);

  let yAxis = d3
    .scaleLinear()
    .domain([globals.abs.incMax + globals.abs.incMin, 0])
    .range([0, height]);

  const draw = function () {
    const container = d3.select("#scatter-container");
    container.attr(
      "transform",
      "translate(" +
        (globals.dims.left + globals.dims.right) +
        ", " +
        globals.dims.top +
        ")"
    );
    drawColours();
    makeXAxis();
    makeYAxis();
    setLoaded(true);
  };

  function drawColours() {
    const colours = d3.select("#colours");
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        colours
          .append("rect")
          .attr("x", (j * width) / 3)
          .attr("y", (i * height) / 3)
          .attr("width", width / 3)
          .attr("height", height / 3)
          .attr("fill", globals.colours[i][j]);
  }

  function makeXAxis() {
    d3.select("#axis-x")
      .call(d3.axisBottom(xAxis))
      .attr("transform", "translate(0, " + height + ")")
      .append("text")
      .attr("y", globals.dims.bot - globals.dims.top)
      .attr("x", width / 1.7)
      .style("text-anchor", "end")
      .attr("font-size", "10pt")
      .attr("fill", "black")
      .text("Burglary Rate (per 100.000 people)");
  }

  function makeYAxis() {
    d3.select("#axis-y")
      .call(d3.axisLeft(yAxis))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -(globals.dims.top + globals.dims.bot))
      .attr("font-size", "10pt")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text("Per Capita Disposable Personal Income (in $)");
  }

  function makeDots() {
    d3.selectAll(".point").remove();
    d3.select("#dots")
      .selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("r", 5)
      .attr("cx", (d) => {
        return xAxis(d.values[0].burglary);
      })
      .attr("cy", (d) => {
        return yAxis(d.values[0].income);
      })
      .attr("class", "point")
      .attr("id", (d) => "dot_" + d.state.replace(/ /g, ""))
      .on("mouseover", mouseOver)
      .on("mouseout", unhighlight);
  }

  const mouseOver = function (event, d) {
    d3.select("#dots")
      .append("text")
      .text(d.state)
      .attr("x", xAxis(d.values[0].burglary) + globals.dims.right)
      .attr("y", yAxis(d.values[0].income))
      .attr("class", "state-label")
      .attr("id", "state");
    d3.select("#dot_" + d.state.replace(/ /g, "")).attr(
      "class",
      "selected-dot"
    );
    d3.selectAll(".point").attr("class", "hidden");
  };

  const unhighlight = function (event, d) {
    d3.select("#state").remove();
    d3.select("#dot_" + d.state.replace(/ /g, "")).attr("class", "point");
    d3.selectAll(".hidden").attr("class", "point");
  };

  useEffect(() => {
    draw();
    setX(() => xAxis);
    setY(() => yAxis);
    setScatterLoaded(true);
  }, []);

  makeDots();

  return (
    <div className="col-md-6">
      <svg id="scatter-svg" className="w-100 h-100">
        <g id="scatter-container">
          <g id="colours" />
          <g id="dots" />
          <g id="axis-x" />
          <g id="axis-y" />
          <g id="brush" />
        </g>
      </svg>
    </div>
  );
}
