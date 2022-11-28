import logo from "../resources/logo.svg";
import "../static/App.css";
import Slider from "./Slider";
import ScatterPlot from "./ScatterPlot";
import Choropleth from "./Choropleth";
import * as d3 from "d3";
import mapStatesUsa from "../resources/us-states-geo.json";

function App() {
  var burglary,
    income = null;
  d3.csv("../resources/usa_burglary_rates_1984-2014.csv").then(
    (data) => (burglary = data)
  );
  d3.csv("../resources/usa_disposable_personal_income_1984_2014.csv").then(
    (data) => (income = data)
  );

  return (
    <div>
      <Choropleth />
      <ScatterPlot />
      <Slider />
    </div>
  );
}

export default App;
