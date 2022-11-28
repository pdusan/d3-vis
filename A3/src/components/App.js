import logo from "../resources/logo.svg";
import "../static/App.css";
import Slider from "./Slider";
import ScatterPlot from "./ScatterPlot";
import Choropleth from "./Choropleth";

function App() {
  return (
    <div>
      <Choropleth />
      <ScatterPlot />
      <Slider />
    </div>
  );
}

export default App;
