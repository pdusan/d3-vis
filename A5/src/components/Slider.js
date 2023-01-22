import { useEffect, useState } from "react";

export default function Slider({ max, passVal, mode }) {
  const [val, setVal] = useState(1);

  useEffect(() => {
    passVal(val);
  }, [passVal, val]);

  const changeValue = function (event) {
    setVal(event.target.value);
  };

  return (
    <div className="row">
      <div className="col-2">
        <span>{mode}</span>
      </div>
      <div className="col-10">
        <input
          type="range"
          className="form-range"
          min="1"
          max={max}
          step="1"
          defaultValue="1"
          onChange={changeValue}
        />
      </div>
    </div>
  );
}
