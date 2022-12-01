import { useContext, useEffect, useState } from "react";
import { dimsContext } from "./App";
import * as d3 from "d3";

export default function ScatterPlot({ data }) {
  const globals = useContext(dimsContext);

  const draw = function () {
    const container = d3.select("#scatter-container");
    container.attr("transform", "translate(" + globals.dims.left + ", 0)");
    drawColours();
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

  useEffect(draw, []);

  console.log(data);
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
