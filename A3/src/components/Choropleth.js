import mapStatesUsa from "../resources/us-states-geo.json";
import * as d3 from "d3";
import { useContext, useEffect } from "react";
import { dimsContext } from "./App";

export default function Choropleth({ year }) {
  const draw = function () {
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath().projection(projection);

    const choropleth = d3.select("#choropleth");
    choropleth
      .selectAll("path")
      .data(mapStatesUsa.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("fill", "white");
  };

  useEffect(draw, []);

  const globals = useContext(dimsContext);

  return (
    <div>
      <svg id="choro-svg" width={1080} height={600}>
        <g id="choro-container">
          <g id="choropleth" />
        </g>
      </svg>
    </div>
  );
}
