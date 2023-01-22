/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChoroplethMap from "./ChoroplethMap";
import DatePicker from "./DatePicker";
import ScatterPlot from "./Scatterplot";
import dataset from "../resources/owid-covid-data.csv";
import * as d3 from "d3";
import BarChart from "./BarChart";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryList, updateCountryList] = useState([]);
  const [date, setDate] = useState(Date(2022, 0, 1));
  const [choroData, setChoroData] = useState(null);
  const [scatData, setScatData] = useState(null);
  const [densData, setDensData] = useState(null);
  const [devData, setDevData] = useState(null);

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
            name: d.location,
          };
        })
        .filter((i) => i.date.toDateString() === date.toDateString())
    );
  }, [date]);

  useEffect(() => {
    setScatData(
      data
        .map((d) => {
          return {
            iso_code: d.iso_code,
            vaccs: d.total_vaccinations_per_hundred,
            cases: d.new_cases,
            date: d.date,
            name: d.location,
          };
        })
        .filter((i) => i.date.toDateString() === date.toDateString())
        .filter((i) => !i.iso_code.includes("OWID"))
        .filter((i) => countryList.includes(i.iso_code))
    );

    setDensData(
      data
        .map((d) => {
          return {
            iso_code: d.iso_code,
            date: d.date,
            density: d.population_density,
            name: d.location,
          };
        })
        .filter((i) => i.date.toDateString() === date.toDateString())
        .filter((i) => !i.iso_code.includes("OWID"))
        .filter((i) => countryList.includes(i.iso_code))
    );

    setDevData(
      data
        .map((d) => {
          return {
            iso_code: d.iso_code,
            date: d.date,
            development: d.human_development_index,
            name: d.location,
          };
        })
        .filter((i) => i.date.toDateString() === date.toDateString())
        .filter((i) => !i.iso_code.includes("OWID"))
        .filter((i) => countryList.includes(i.iso_code))
    );
  }, [date, countryList]);

  useEffect(() => {
    if (countryList.includes(selectedCountry))
      updateCountryList(countryList.filter((i) => i !== selectedCountry));
    else updateCountryList([...countryList, selectedCountry]);
  }, [selectedCountry]);

  return (
    data && (
      <div className="row h-50">
        {choroData && (
          <ChoroplethMap
            data={choroData}
            setSelectedCountry={setSelectedCountry}
          />
        )}
        <DatePicker passDate={setDate} />
        <div className="row h-50">
          {scatData && <ScatterPlot data={scatData} />}
          {densData && (
            <BarChart
              data={densData}
              category={"bar"}
              label={"Population per km squared"}
              color={"steelblue"}
              property={"density"}
            />
          )}
          {devData && (
            <BarChart
              data={devData}
              category={"dev"}
              label={"Human Development Index"}
              color={"grey"}
              property={"development"}
            />
          )}
        </div>
      </div>
    )
  );
}
