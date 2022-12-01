import { useContext, useEffect, useState } from "react";
import { dimsContext } from "./App";
import * as d3 from "d3";

export default function ScatterPlot({ data }) {
  const globals = useContext(dimsContext);
  const [test, setTest] = useState(false);

  const draw = function () {
    const container = d3.select("#scatter-container");
    container.attr("transform", "translate(" + globals.dims.left + ", 0)");
    drawColours();
    setTest(true);
  };

  function drawColours() {
    const colours = d3.select("#colours");
    let width = 300;
    let height = 200;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        colours
          .append("rect")
          .attr("x", j * width)
          .attr("y", i * height)
          .attr("width", width)
          .attr("height", height)
          .attr("fill", globals.colours[i][j]);
  }

  let xAxis;
  function makeXAxis() {
    let burgMax = d3.max(data.map((d) => d.values[0].burglary));
    let burgMin = d3.min(data.map((d) => d.values[0].burglary));
    xAxis = d3
      .scaleLinear()
      .domain([0, burgMax + burgMin])
      .range([0, 1000]);
    d3.select("#axis-x").call(d3.axisBottom(xAxis));
  }

  let yAxis;
  function makeYAxis() {
    let incMax = d3.max(data.map((d) => d.values[0].income));
    let incMin = d3.min(data.map((d) => d.values[0].income));
    yAxis = d3
      .scaleLinear()
      .domain([incMax + incMin, 0])
      .range([0, 600]);
    d3.select("#axis-y").call(d3.axisLeft(yAxis));
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
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("fill", "white")
      .attr("class", "point");
  }

  useEffect(draw, []);
  test && makeXAxis();
  test && makeYAxis();
  test && makeDots();
  return (
    <div>
      <svg id="scatter-svg" width={1080} height={600}>
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
