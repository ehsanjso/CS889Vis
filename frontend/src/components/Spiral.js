import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ResizeObserver } from "@juggle/resize-observer";
import * as d3 from "d3";
import DATA from "../assets/data.json";
import Logo from "./Logo";
import TimeSpiral from "./TimeSpiral";
import MAIN from "../assets/img/main.png";
import "../styles/components/spiral.scss";

const chartSettings = {
  marginTop: 30,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 20,
};

export default function Spiral() {
  const [ref, dms] = useChartDimensions(chartSettings);
  const refSvg = useRef();

  useEffect(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0) {
      // 1. Access data
      let dataset = [];

      // 3. Draw canvas
      const svg = d3.select(refSvg.current);
      const wrapper = d3.select(refSvg.current);

      const bounds = wrapper
        .append("g")
        .attr("class", "bound")
        .style(
          "transform",
          `translate(${dms.marginLeft}px, ${dms.marginTop}px)`
        );

      const data = DATA["sanfrancisco"].map((d) => ({
        date: new Date(d["Date time"]),
        temp: +d["Temperature"],
      }));

      const chart = new TimeSpiral(bounds)
        .size([dms.boundedWidth, dms.boundedHeight])
        .layers(3)
        .style({
          align: "center",
          reverseColor: true, // reverse d3.interpolateRdYlBu
        })
        .palette(d3.interpolateRdYlBu)
        .field({ value: "temp" })
        .data(data)
        .render();

      // 4. Create scales

      // 5. Draw data

      // 6. Draw peripherals

      // // 7. Draw Scene Breaks
    }
    return () => {
      const svg = d3.select(refSvg.current);
      svg.selectAll("*").remove();
    };
  }, [dms.boundedHeight, dms.boundedWidth, dms.marginLeft, dms.marginTop]);

  return (
    <div className="spiral" ref={ref}>
      <Logo />
      <Link to="/">
        <img src={MAIN} alt="main" className="back-to-main" />
      </Link>
      <svg width={dms.width} height={dms.height} ref={refSvg}></svg>
    </div>
  );
}

const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions];
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      const entry = entries[0];
      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [dimensions, width, height]);
  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });
  return [ref, newSettings];
};

const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop,
    marginRight: dimensions.marginRight,
    marginBottom: dimensions.marginBottom,
    marginLeft: dimensions.marginLeft,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};
