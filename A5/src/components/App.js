import { useEffect, useState } from "react";
import ChoroplethMap from "./ChoroplethMap";
import Histogram from "./Histogram";
import ScatterPlot from "./Scatterplot";
import StackedBarChart from "./StackedBarChart";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    // fetch and process data here
    // setData(processedData);
  }, []);

  return (
    <div>
      <ScatterPlot
        data={data}
        selectedCountry={selectedCountry}
        onCountrySelection={setSelectedCountry}
      />
      <ChoroplethMap data={data} />
      <Histogram data={data} />
      <StackedBarChart data={data} />
    </div>
  );
}
