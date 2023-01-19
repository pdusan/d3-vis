import { useEffect, useState } from "react";

export default function Slider({ max, passVal }) {
  const [val, setVal] = useState(1);

  useEffect(() => {
    passVal(val);
  }, [passVal, val]);

  const changeValue = function (event) {
    setVal(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        className="form-range"
        min="1"
        max={max}
        step="1"
        defaultValue="1"
        onChange={changeValue}
      />
      <span>{val}</span>
    </div>
  );
}
