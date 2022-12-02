import "../static/App.css";
import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import ScatterPlot from "./ScatterPlot";
import Choropleth from "./Choropleth";
import * as d3 from "d3";
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

const globals = {
  dims: {
    top: 20,
    bot: 50,
    left: 50,
    right: 50,
    width: 1920,
    height: 1080,
  },
  colours: {
    0: {
      0: "#2d78a9",
      1: "#2d6a73",
      2: "#2d5b37",
    },
    1: {
      0: "#81a6be",
      1: "#819381",
      2: "#807e3e",
    },
    2: {
      0: "#d3d3d3",
      1: "#d2bb8f",
      2: "#d1a045",
    },
  },
  abs: {
    burgMax: "",
    burgMin: "",
    incMax: "",
    incMin: "",
  },
};

export const dimsContext = React.createContext();

export default function App() {
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  const [activeData, setActiveData] = useState();
  const [xScale, setXScale] = useState(() => {});
  const [yScale, setYScale] = useState(() => {});
  const [scatterLoaded, setScatterLoaded] = useState(false);

  const getActive = function (year) {
    let activeStates = [];
    data.forEach((d) => {
      let val = d.values.filter((v) => +v.year === +year);
      let item = {};
      item.state = d.state;
      item.values = val;
      activeStates.push(item);
    });
    return activeStates;
  };

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
            let state = set.find((o) => o.state === i.state);
            for (let k = 0; k < i.values.length; k++) {
              state.values[k].income = i.values[k].income;
            }
          });
          setData(set);

          setLoaded(true);
        })
      );
  }, []);

  if (loaded) {
    let burgMax = d3.max(
      data.map((d) => d3.max(d.values.map((s) => s.burglary)))
    );
    let burgMin = d3.min(
      data.map((d) => d3.min(d.values.map((s) => s.burglary)))
    );
    let incMax = d3.max(data.map((d) => d3.max(d.values.map((s) => s.income))));
    let incMin = d3.min(data.map((d) => d3.min(d.values.map((s) => s.income))));
    globals.abs.burgMax = burgMax;
    globals.abs.burgMin = burgMin;
    globals.abs.incMax = incMax;
    globals.abs.incMin = incMin;
  }

  return (
    loaded && (
      <dimsContext.Provider value={globals}>
        <div className="container-fluid d-flex h-100 flex-column">
          <div className="row h-75">
            <ScatterPlot
              data={activeData}
              setX={setXScale}
              setY={setYScale}
              setScatterLoaded={setScatterLoaded}
            />
            {scatterLoaded && (
              <Choropleth data={activeData} xScale={xScale} yScale={yScale} />
            )}
          </div>
          <div className="row">
            <Slider update={setActiveData} updateFunc={getActive} />
          </div>
        </div>
      </dimsContext.Provider>
    )
  );
}
