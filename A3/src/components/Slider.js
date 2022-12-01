import { useEffect } from "react";

export default function Slider({ update, updateFunc }) {
  const changeYear = function (event) {
    update(updateFunc(event.target.value));
  };

  useEffect(() => {
    update(updateFunc(1984));
  }, []);

  return (
    <input
      type="range"
      className="form-range"
      min="1984"
      max="2014"
      step="1"
      onChange={changeYear}
      id="year-slider"
    />
  );
}
