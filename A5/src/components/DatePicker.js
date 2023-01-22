import { useEffect, useState } from "react";
import Slider from "./Slider";

export default function DatePicker({ passDate }) {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2022);

  useEffect(() => {
    let date = new Date(year, month - 1, day);
    passDate(date);
  }, [year, month, day, passDate]);

  return (
    <div className="col-3 d-flex align-items-center justify-content-center m-2  ">
      <div className="row">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setYear(2020)}
          >
            2020
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setYear(2021)}
          >
            2021
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setYear(2022)}
          >
            2022
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setYear(2023)}
          >
            2023
          </button>
        </div>
        <Slider max={12} passVal={setMonth} mode={"Month"} />
        <Slider max={31} passVal={setDay} mode={"Day"} />
        <h4 style={{ textAlign: "center" }}>
          {new Date(year, month - 1, day).toDateString()}
        </h4>
        <div className="info" style={{ opacity: "0" }}></div>
      </div>
    </div>
  );
}
