import logo from "../resources/logo.svg";
import "../static/App.css";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import ScatterPlot from "./ScatterPlot";
import Choropleth from "./Choropleth";
import * as d3 from "d3";
import mapStatesUsa from "../resources/us-states-geo.json";
import burglary from "../resources/usa_burglary_rates_1984-2014.csv";
import income from "../resources/usa_disposable_personal_income_1984_2014.csv";

/**
 * Rearrange the input dataset to be more suitable for plotting
 * @param {Object} data Dataset to convert
 * @param {String} name The name of the measured value
 * @returns {Object} Converted data
 */
function niceData(data, name) {
  var col = data.columns.slice(1);
  data.forEach((d) => {
    col.forEach((c) => {
      d[c] = +d[c];
    });
  });

  var grouped = d3.group(data, (d) => d["State"]);
  var betterData = [];
  Array.from(grouped.keys()).forEach((d) => {
    let item = {};
    item.state = d;
    item.values = [];
    col.forEach((c) => {
      let entry = {};
      entry.year = c;
      entry[name] = grouped.get(d)[0][c];
      item.values.push(entry);
    });
    betterData.push(item);
  });
  return betterData;
}

function App() {
  const [data, setData] = useState();

  // Both data sets are loaded and transformed according to the above defined function
  // and then "manually" deep merged, so that each state has a series of years and their
  // corresponding income and burlary values
  useEffect(() => {
    let set = d3
      .csv(burglary)
      .then((d) => (set = niceData(d, "burglary")))
      .then(
        d3.csv(income).then((s) => {
          let temp = niceData(s, "income");
          temp.forEach((i) => {
            let state = set.filter((o) => o.State === i.State);
            for (let k = 0; k < i.values.length; k++) {
              state[0].values[k].income = i.values[k].income;
            }
          });
          setData(set);
        })
      );
  }, []);

  return (
    <div>
      <Choropleth />
      <ScatterPlot />
      <Slider />
    </div>
  );
}

export default App;
