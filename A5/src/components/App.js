import { useEffect, useState } from "react";
import ChoroplethMap from "./ChoroplethMap";
import DatePicker from "./DatePicker";
import Histogram from "./Histogram";
import ScatterPlot from "./Scatterplot";
import StackedBarChart from "./StackedBarChart";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [date, setDate] = useState(Date(2020, 0, 1));

  useEffect(() => {
    // fetch and process data here
    // setData(processedData);
  }, []);

  return (
    <div>
      <DatePicker passDate={setDate} />
      {/* <span>{date.toDateString()}</span> */}
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
