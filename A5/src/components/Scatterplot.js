/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function ScatterPlot({ data, width = 640, height = 580 }) {
  var minCases = d3.min(data.map((d) => d.cases));
  var maxCases = d3.max(data.map((d) => d.cases));
  var minVaccs = d3.min(data.map((d) => d.vaccs));
  var maxVaccs = d3.max(data.map((d) => d.vaccs));

  var xAxis = d3
    .scaleLinear()
    .domain([0, minVaccs + maxVaccs])
    .range([0, width - 120]);

  var yAxis = d3
    .scaleLinear()
    .domain([maxCases + minCases, 0])
    .range([100, height]);

  function makeXAxis() {
    d3.select("#x-axis")
      .call(d3.axisBottom(xAxis))
      .attr("transform", "translate(0, " + height + ")")
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .style("text-anchor", "end")
      .attr("font-size", "10pt")
      .attr("fill", "black")
      .text("Total Vaccinations per Hundred");
  }

  function makeYAxis() {
    d3.select("#y-axis")
      .call(d3.axisLeft(yAxis))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -height / 2)
      .attr("font-size", "10pt")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text("New COVID Cases");
  }

  function makeDots() {
    d3.selectAll(".point").remove();
    d3.select("#plot")
      .selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("r", 5)
      .attr("cx", (d) => {
        return xAxis(d.vaccs);
      })
      .attr("cy", (d) => {
        return yAxis(d.cases);
      })
      .attr("class", (d) => {
        return "point plotted" + d.iso_code;
      })
      .attr("fill", "steelblue")
      .on("mouseover", itemHover)
      .on("mouseout", unhover);
  }

  const itemHover = function (d) {
    var cls = this.getAttribute("class").split(" ")[1];
    d3.selectAll(".bar").style("opacity", 0.5).style("stroke", "transparent");
    d3.selectAll(".point").style("opacity", 0.5).style("stroke", "transparent");
    d3.selectAll("." + cls)
      .style("opacity", 1)
      .style("stroke", "grey");
  };

  const unhover = function () {
    d3.selectAll(".bar").style("opacity", 1).style("stroke", "transparent");
    d3.selectAll(".point").style("opacity", 1).style("stroke", "transparent");
  };

  const draw = function () {
    if (data != null && data.length !== 0) {
      const container = d3.select("#scatter-container");
      container.attr("transform", "translate(100,-50)");
      makeXAxis();
      makeYAxis();
      makeDots();
    }
  };

  const [missing, setMissing] = useState(0);

  useEffect(() => {
    setMissing(data.filter((i) => Object.values(i).includes(null)).length);
    data = data.filter((i) => !Object.values(i).includes(null));
    draw();
  }, [data]);

  return (
    <div className="col-4 mt-2">
      <h6 style={{ textAlign: "center" }}>{missing} missing data item(s)</h6>
      <svg id="scatter-svg" width={width} height={height}>
        <g id="scatter-container">
          <g id="plot" />
          <g id="x-axis" />
          <g id="y-axis" />
        </g>
      </svg>
    </div>
  );
}
