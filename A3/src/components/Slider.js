import { useEffect, useState } from "react";

export default function Slider({ update, updateFunc }) {
  const changeYear = function (event) {
    update(updateFunc(event.target.value));
  };
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    update(updateFunc(1984));
    setLoaded(true);
  }, []);

  return (
    <div className="col-md-3 offset-md-3">
      <input
        type="range"
        className="form-range"
        min="1984"
        max="2014"
        step="1"
        onChange={changeYear}
        id="year-slider"
      />
      {loaded && <p> Year: {document.getElementById("year-slider").value}</p>}
    </div>
  );
}
