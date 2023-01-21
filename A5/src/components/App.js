import { useEffect, useState } from "react";
import ChoroplethMap from "./ChoroplethMap";
import DatePicker from "./DatePicker";
import Histogram from "./Histogram";
import ScatterPlot from "./Scatterplot";
import StackedBarChart from "./StackedBarChart";
import dataset from "../resources/owid-covid-data.csv";
import * as d3 from "d3";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [date, setDate] = useState(Date(2020, 0, 1));
  const [choroData, setChoroData] = useState(null);

  useEffect(() => {
    d3.csv(dataset, d3.autoType).then((d) => {
      setData(d);
    });
  }, []);

  useEffect(() => {
    setChoroData(
      data
        .map((d) => {
          return {
            iso_code: d.iso_code,
            date: d.date,
            reproduction_rate: d.reproduction_rate,
          };
        })
        .filter((i) => i.date.toDateString() === date.toDateString())
    );
  }, [date]);

  // useEffect(() => console.log(selectedCountry), [selectedCountry]);
  return (
    <div>
      {data && (
        <>
          <DatePicker passDate={setDate} />
          <ChoroplethMap
            data={choroData}
            setSelectedCountry={setSelectedCountry}
          />
          <ScatterPlot
            data={data}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
          <Histogram data={data} />
          <StackedBarChart data={data} />
        </>
      )}
    </div>
  );
}
