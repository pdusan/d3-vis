import mapStatesUsa from "../resources/us-states-geo.json";
import * as d3 from "d3";
import { useContext, useEffect } from "react";
import { dimsContext } from "./App";

export default function Choropleth({ data, xScale, yScale }) {
  const draw = function () {
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath().projection(projection);

    d3.select("#choropleth")
      .selectAll("path")
      .data(mapStatesUsa.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("fill", "white");
    d3.select("#choropleth")
      .selectAll("path")
      .data(data)
      .attr("fill", (d) => getStateColour(d.state));
  };

  useEffect(draw, []);
  useEffect(() => {
    d3.select("#choropleth")
      .selectAll("path")
      .data(data)
      .attr("fill", (d) => getStateColour(d.state));
  }, [data]);

  const globals = useContext(dimsContext);

  function getStateColour(state) {
    let blockWidth = (800 - globals.dims.left - globals.dims.right) / 3;
    let blockHeight = (500 - globals.dims.bot - globals.dims.top) / 3;
    let st = data.find((d) => d.state === state);
    let burgValue = xScale(st.values[0].burglary);
    let incValue = yScale(st.values[0].income);
    let i, j;
    if (burgValue <= blockWidth) i = 0;
    else if (burgValue > blockWidth && burgValue <= 2 * blockWidth) i = 1;
    else i = 2;
    if (incValue <= blockHeight) j = 0;
    else if (incValue > blockHeight && incValue <= 2 * blockHeight) j = 1;
    else j = 2;
    return globals.colours[j][i];
  }

  console.log(d3.selectAll(".selected-dot"));

  return (
    <div className="col-md-6">
      <svg id="choro-svg" className="w-100 h-100">
        <g id="choro-container">
          <g id="choropleth" />
        </g>
      </svg>
    </div>
  );
}
