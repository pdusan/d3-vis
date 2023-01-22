/* eslint-disable react-hooks/exhaustive-deps */
import * as d3 from "d3";
import { useEffect, useState } from "react";

export default function BarChart({
  data,
  width = 640,
  height = 580,
  category,
  label,
  color,
  property,
}) {
  var svgID = category + "-svg";
  var contID = category + "-container";
  var plotID = category + "-plot";
  var xID = "x-axis-" + category;
  var yID = "y-axis-" + category;

  const [missing, setMissing] = useState(0);

  useEffect(() => {
    setMissing(data.filter((i) => Object.values(i).includes(null)).length);
    data = data.filter((i) => !Object.values(i).includes(null));
    draw();
  }, [data]);

  var minValue = d3.min(data.map((d) => d[property]));
  var maxValue = d3.max(data.map((d) => d[property]));

  var yAxis = d3
    .scaleLinear()
    .domain([maxValue + minValue, 0])
    .range([100, height]);

  var xAxis = d3
    .scaleBand()
    .domain(data.map((i) => i.iso_code))
    .range([0, width - 120]);

  function makeXAxis() {
    d3.select("#" + xID)
      .call(d3.axisBottom(xAxis))
      .attr("transform", "translate(0, " + height + ")")
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .style("text-anchor", "end")
      .attr("font-size", "10pt")
      .attr("fill", "black")
      .text("Country");
  }

  function makeYAxis() {
    d3.select("#" + yID)
      .call(d3.axisLeft(yAxis))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -height / 2)
      .attr("font-size", "10pt")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text(label);
  }

  function makeBars() {
    d3.selectAll("." + category).remove();
    d3.select("#" + plotID)
      .selectAll(".country-bar" + category)
      .data(data)
      .join("rect")
      .attr("x", (d) => {
        return xAxis(d.iso_code);
      })
      .attr("y", (d) => {
        return yAxis(d[property]);
      })
      .attr("height", (d) => {
        return height - yAxis(d[property]);
      })
      .attr("width", xAxis.bandwidth())
      .attr("class", (d) => {
        return "bar plotted" + d.iso_code;
      })
      .attr("fill", color)
      .on("mouseover", itemHover)
      .on("mouseout", unhover);
  }

  const draw = function () {
    if (data != null && data.length !== 0) {
      const container = d3.select("#" + contID);
      container.attr("transform", "translate(100,-50)");
      makeXAxis();
      makeYAxis();
      makeBars();
    }
  };

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

  return (
    <div className="col-4 mt-2">
      <h6 style={{ textAlign: "center" }}>{missing} missing data item(s)</h6>
      <svg id={svgID} width={width} height={height}>
        <g id={contID}>
          <g id={plotID} />
          <g id={xID} />
          <g id={yID} />
        </g>
      </svg>
    </div>
  );
}
