import React, { useEffect, useState, useRef, useMemo } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import * as d3 from "d3";
import * as R from "ramda";
import { CaretRightOutlined } from "@ant-design/icons";
import "../styles/components/timeline.scss";

const chartSettings = {
  marginTop: 30,
  marginRight: 30,
  marginBottom: 0,
  marginLeft: 50,
};

export default function Timeline({ data, activeTime, setActiveTime }) {
  const [ref, dms] = useChartDimensions(chartSettings);
  const refSvg = useRef();

  useEffect(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0 && data) {
      // 1. Access data
      let dataset = [...data];
      const dateRange = R.uniq(R.map(R.prop("Date"), dataset));

      // 3. Draw canvas
      const wrapper = d3.select(refSvg.current);

      const bounds = wrapper
        .append("g")
        .attr("class", "bound")
        .style(
          "transform",
          `translate(${dms.marginLeft}px, ${dms.marginTop}px)`
        );

      const scaleX = d3
        .scaleLinear()
        .domain([0, 179])
        .range([0, dms.boundedWidth]);

      const interval = scaleX(1) - scaleX(0);

      // 4. Create scales

      const lines = bounds
        .selectAll(".date")
        .data(dateRange)
        .enter()
        .append("line")
        .attr("x1", (d, i) => scaleX(i))
        .attr("x2", (d, i) => scaleX(i))
        .attr("y1", (d) => (d === activeTime ? -20 : 0))
        .attr("y2", 20)
        .attr("stroke", (d) => (d === activeTime ? "#F38181" : "#8785A2"))
        .attr("stroke-width", 2);

      const bins = bounds
        .selectAll(".date-bins")
        .data(dateRange)
        .enter()
        .append("rect")
        .attr("class", "date-bins")
        .attr("x", (d, i) => scaleX(i) - interval / 2)
        .attr("y", 0)
        .attr("width", interval)
        .attr("height", 30)
        .attr("fill", "transparent")
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .on("click", mouseClick);

      function mouseOver(event, d) {
        event.stopPropagation();
        lines
          .transition()
          .duration(100)
          .attr("y1", (datum) => (d === datum ? -20 : 0))
          .attr("stroke", (datum) => (d === datum ? "#95E1D3" : "#8785A2"));
      }

      function mouseOut(event, d) {
        event.stopPropagation();

        lines
          .transition()
          .duration(100)
          .attr("y1", (d) => (d === activeTime ? -20 : 0))
          .attr("stroke", (d) => (d === activeTime ? "#F38181" : "#8785A2"));
      }

      function mouseClick(event, d) {
        event.stopPropagation();
        setActiveTime(d);
      }

      // 5. Draw data

      // 6. Draw peripherals

      // // 7. Draw Scene Breaks
    }
    return () => {
      const svg = d3.select(refSvg.current);
      svg.selectAll("*").remove();
    };
  }, [
    dms.boundedHeight,
    dms.boundedWidth,
    dms.marginLeft,
    dms.marginTop,
    data,
    activeTime,
  ]);
  return (
    <div className="timeline" ref={ref}>
      <svg width={dms.width} height={dms.height} ref={refSvg}></svg>
      <div className="play-btn">
        <CaretRightOutlined />
      </div>
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
