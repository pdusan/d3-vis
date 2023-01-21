import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import mapData from "../resources/custom.geo.json";

export default function ChoroplethMap({ data, width = 1500, height = 500 }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  function zooming(event) {
    d3.select("#choropleth")
      .selectAll("path")
      .attr("transform", event.transform);
  }

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zooming);

  const drawMap = function () {
    let projection = d3.geoNaturalEarth1();
    let path = d3.geoPath().projection(projection);

    d3.select("#choro-svg").call(zoom);

    d3.select("#choropleth")
      .selectAll("path")
      .data(mapData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("fill", "white")
      .on("mousedown", pickCountry);
  };

  useEffect(drawMap, []);

  const pickCountry = (d) => {
    console.log(d.target.__data__.properties.adm0_iso);
    setSelectedCountry(d.target.__data__.properties.adm0_iso);
  };

  return (
    <div>
      <svg id="choro-svg" width={width} height={height}>
        <g id="choro-container">
          <g id="choropleth" />
        </g>
      </svg>
    </div>
  );
}
