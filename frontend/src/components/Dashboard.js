import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { ResizeObserver } from "@juggle/resize-observer";
import { host } from "../actions/consts/host";
import * as d3 from "d3";
import * as R from "ramda";
import { history } from "../routers/AppRouter";
import Logo from "./Logo";
import Timeline from "./Timeline";
import "../styles/components/dashboard.scss";

const chartSettings = {
  marginTop: 250,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
};

const nunNumericProperties = ["Date", "Type", "Protocol"];

export default function Dashboard() {
  const [ref, dms] = useChartDimensions(chartSettings);
  const refSvg = useRef();
  const [activeTime, setActiveTime] = useState(undefined);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`${host}/metric/all`);
      setData(result.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0 && data) {
      // 1. Access data
      let dataset = [...data];
      if (activeTime === undefined) {
        const dateRange = R.uniq(R.map(R.prop("Date"), dataset));
        setActiveTime(dateRange[0]);
      }
      const groupedByDate = R.groupBy(R.prop("Date"), dataset);
      const toDateData = activeTime
        ? groupedByDate[activeTime]
        : R.values(groupedByDate)[0];
      const groupedByProtocol = R.groupBy(R.prop("Protocol"), toDateData);
      const protocols = R.keys(groupedByProtocol);
      const metrics = R.filter(
        (el) => !nunNumericProperties.includes(el),
        R.keys(dataset[0])
      );
      const matrixData = R.values(groupedByProtocol).map((el, i) =>
        R.zip(metrics, R.props(metrics, el[0])).map((el) =>
          R.concat([protocols[i]], el)
        )
      );

      const metricsExtent = [];

      for (var metric of metrics) {
        const values = R.map(R.prop(metric), toDateData);
        const dataExtent = d3.extent(R.map((el) => parseFloat(el), values));
        metricsExtent.push(dataExtent);
      }

      // 3. Draw canvas
      const svg = d3.select(refSvg.current);

      // basic variable
      var minValue = 0,
        cellSize = 50,
        cellsMargined = cellSize + 50;

      const scale = (extent) =>
        d3
          .scaleLinear()
          .domain(extent)
          .range([minValue, cellSize / 2]);

      // color
      var colorScale = d3.scaleOrdinal(d3["schemeTableau10"]);
      let canvas = svg
        .append("g")
        .attr(
          "transform",
          translate(
            dms.boundedWidth / 2 - (cellsMargined * metrics.length) / 2,
            dms.marginTop
          )
        );
      // drawCircle
      let group = canvas
        .selectAll("g")
        .data(matrixData)
        .enter()
        .append("g")
        .attr("class", "rows")
        .attr("transform", (v, i) => translate(0, i * cellSize));
      group
        .selectAll("circle")
        .data((v) => v)
        .enter()
        .append("circle")
        .attr("class", "dots")
        .attr("cx", (d, j) => j * cellsMargined)
        .attr("cy", 0)
        .attr("r", (d, i) => scale(metricsExtent[i])(d[2]))
        .attr("fill", (d, i) => colorScale(i))
        .attr("transform", translate(cellSize / 2 + 30, cellSize / 2))
        .on("click", mouseClick);

      // drawLabel
      for (let i = 0; i < metrics.length; i++) {
        // cols
        canvas
          .append("text")
          .attr("x", i * cellsMargined + 30)
          .attr("y", -30)
          .text(metrics[i])
          .attr("text-anchor", "middle")
          .attr("dx", cellSize / 2);
      }

      for (let i = 0; i < protocols.length; i++) {
        // rows
        canvas
          .append("text")
          .attr("x", -30)
          .attr("y", i * cellSize)
          .text(protocols[i])
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "end")
          .attr("dy", cellSize / 2);
      }

      canvas
        .append("line")
        .attr("x1", -10)
        .attr("x2", -10)
        .attr("y1", -10)
        .attr("y2", cellSize * protocols.length)
        .attr("stroke", "#DBE2EF")
        .attr("stroke-width", 2);

      canvas
        .append("line")
        .attr("x1", -10)
        .attr("x2", cellsMargined * metrics.length)
        .attr("y1", -10)
        .attr("y2", -10)
        .attr("stroke", "#DBE2EF")
        .attr("stroke-width", 2);

      canvas
        .append("line")
        .attr("x1", -10)
        .attr("x2", -80)
        .attr("y1", -10)
        .attr("y2", -80)
        .attr("stroke", "#DBE2EF")
        .attr("stroke-width", 2);

      canvas
        .append("text")
        .attr("x", -30)
        .attr("y", -40)
        .text("Metrics")
        .attr("text-anchor", "end")
        .attr("font-size", "1.7em")
        .attr("transform", "rotate(45)")
        .attr("fill", "#393E46")
        .attr("dy", cellSize / 2);

      canvas
        .append("text")
        .attr("x", -70)
        .attr("y", 0)
        .text("Protocols")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.7em")
        .attr("fill", "#393E46")
        .attr("transform", "rotate(45)")
        .attr("dy", cellSize / 2);

      // utils
      function translate(x, y) {
        return "translate(" + x + "," + y + ")";
      }

      function mouseClick(event, d) {
        event.stopPropagation();
        console.log(d);
        history.push(`/spiral/${d[0]}/${d[1]}`);
      }
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
    <div className="dashboard" ref={ref}>
      <Logo />
      <svg width={dms.width} height={dms.height} ref={refSvg}></svg>
      {data && (
        <Timeline
          data={data}
          activeTime={activeTime}
          setActiveTime={setActiveTime}
        />
      )}
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
