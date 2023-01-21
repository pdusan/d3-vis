/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import * as d3 from "d3";

import mapData from "../resources/custom.geo.json";

export default function ChoroplethMap({
  data,
  width = 1000,
  height = 500,
  setSelectedCountry,
}) {
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

    if (data != null && data.length !== 0) {
      d3.selectAll("path").remove();

      let maxRep = d3.max(data.map((d) => d.reproduction_rate));
      let minRep = d3.min(data.map((d) => d.reproduction_rate));

      const colorScale = d3
        .scaleQuantize()
        .domain([minRep, maxRep])
        .range(d3.schemeBlues[6]);

      d3.select("#choropleth")
        .selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "transparent")
        .attr("stroke-width", 1)
        .attr("id", (d) => d.properties.adm0_iso)
        .attr("class", "country")
        .attr("fill", (d) => {
          let iso = d.properties.adm0_iso;
          let country = data.find((d) => d.iso_code === iso);
          if (country != null) return colorScale(country.reproduction_rate);
          else return "black";
        })
        .on("mousedown", countryClick)
        .on("mouseover", countryHover)
        .on("mouseleave", unhover);

      var legend = d3
        .select("#choro-container")
        .selectAll("g.item")
        .attr("transform", "translate(-150,270)")
        .data(colorScale.range().reverse())
        .enter()
        .append("g")
        .attr("class", "item");

      legend
        .append("rect")
        .attr("x", 200)
        .attr("y", function (d, i) {
          return i * 30;
        })
        .attr("width", 30)
        .attr("height", 30)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function (d) {
          return d;
        });

      legend
        .append("rect")
        .attr("x", 200)
        .attr("y", 180)
        .attr("width", 30)
        .attr("height", 30)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "black");

      legend
        .append("text")
        .attr("x", 245)
        .attr("y", function (d, i) {
          return i * 30;
        })
        .attr("dy", "1em")
        .text(function (d, i) {
          var extent = colorScale.invertExtent(d);
          var format = d3.format("0.2f");
          return format(+extent[0]) + " - " + format(+extent[1]);
        });

      legend
        .append("text")
        .attr("x", 245)
        .attr("y", 180)
        .attr("dy", "1em")
        .text("Data missing");
    } else {
      return;
    }
  };

  useEffect(() => {
    drawMap();
  }, [data]);

  const countryClick = function (d) {
    d3.selectAll(".selected").attr("class", "country");
    d3.selectAll(".country")
      .style("opacity", 0.5)
      .style("stroke", "transparent")
      .attr("class", "not-selected");
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "grey")
      .attr("class", "selected");
    setSelectedCountry(d.target.__data__.properties.adm0_iso);
  };

  const countryHover = function (d) {
    d3.selectAll(".country")
      .style("opacity", 0.5)
      .style("stroke", "transparent");
    d3.select(this).style("opacity", 1).style("stroke", "grey");
  };

  const unhover = function () {
    d3.selectAll(".country").style("opacity", 1).style("stroke", "transparent");
    d3.selectAll(".not-selected")
      .style("opacity", 0.5)
      .style("stroke", "transparent");
  };

  const deselect = function () {
    d3.selectAll(".selected").attr("class", "country");
    d3.selectAll(".not-selected").attr("class", "country");
  };

  return (
    <div>
      <h2>Worldwide Reproduction Rate</h2>
      <svg id="choro-svg" width={width} height={height}>
        <g id="choro-container">
          <g id="choropleth" />
        </g>
      </svg>
    </div>
  );
}
