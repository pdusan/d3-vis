import { useEffect, useRef } from "react";

export default function ScatterPlot({
  data,
  selectedCountry,
  onCountrySelection,
}) {
  const scatterPlotRef = useRef(null);

  useEffect(() => {
    // use d3 to create the scatter plot
  }, [data, selectedCountry]);

  return <div ref={scatterPlotRef} />;
}
