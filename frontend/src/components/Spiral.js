import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ResizeObserver } from "@juggle/resize-observer";
import { host } from "../actions/consts/host";
import * as d3 from "d3";
import * as R from "ramda";
import moment from "moment";
import Logo from "./Logo";
import TimeSpiral from "./TimeSpiral";
import Loading from "./Loading";
import Header from "./Header";
import InfoBox from "./InfoBox";
import "../styles/components/spiral.scss";

const chartSettings = {
  marginTop: 30,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 20,
};

export default function Spiral({ match }) {
  const [ref, dms] = useChartDimensions(chartSettings);
  const refSvg = useRef();
  const [data, setData] = useState(undefined);
  const [fetchInProg, setFetchInProg] = useState(false);

  const protocol =
    match.params.protocol === "Nexus_Mutual" ? "nexus" : match.params.protocol;
  const metric = match.params.metric;

  useEffect(() => {
    const fetchData = async () => {
      setFetchInProg(true);
      const result = await axios(`${host}/metric/${protocol}`);
      setData(result.data);
      setFetchInProg(false);
    };

    fetchData();
  }, [protocol]);

  useEffect(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0 && data) {
      // 1. Access data
      let dataset = R.map(
        (el) => ({
          date: new Date(el.Date),
          metric: el[metric],
        }),
        data
      );

      const extent = d3.extent(R.map((el) => parseFloat(el.metric), dataset));

      const scale = d3.scaleLinear().domain(extent).range([0, 100]);

      const scaledData = R.map(
        (el) => ({
          ...el,
          metric: scale(el.metric),
        }),
        dataset
      );

      const groupedData = R.groupBy(
        (el) => moment(el.date).format("YYYY-MM-DD"),
        scaledData
      );

      // 3. Draw canvas
      const wrapper = d3.select(refSvg.current);

      const bounds = wrapper
        .append("g")
        .attr("class", "bound")
        .style(
          "transform",
          `translate(${dms.marginLeft}px, ${dms.marginTop}px)`
        );

      var firstDayOfYear = moment(scaledData[0].date).startOf("year");
      var lastDayOfYear = moment(scaledData[scaledData.length - 1].date).endOf(
        "year"
      );

      const numberOfDaysInYear = lastDayOfYear.diff(firstDayOfYear, "days") + 1;

      const finalData = [];

      for (let i = 0; i < numberOfDaysInYear; i++) {
        const d = groupedData[moment(firstDayOfYear).format("YYYY-MM-DD")];

        finalData.push({
          date: new Date(firstDayOfYear),
          metric: d ? d[0].metric : 0,
        });
        firstDayOfYear = firstDayOfYear.add(1, "days");
      }

      const chart = new TimeSpiral(bounds)
        .size([dms.boundedWidth, dms.boundedHeight])
        .layers(3)
        .style({
          align: "center",
          reverseColor: true, // reverse d3.interpolateRdYlBu
        })
        .palette(d3.interpolateRdYlBu)
        .field({ value: "metric" })
        .data(finalData)
        .render();
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
    metric,
  ]);

  return (
    <div className="spiral" ref={ref}>
      <Header />
      <div className="tooltip"></div>
      <Logo />
      <InfoBox
        time={`Protocol: ${protocol} | Metric: ${metric}`}
        icon={false}
      />
      <svg width={dms.width} height={dms.height} ref={refSvg}></svg>
      {fetchInProg && <Loading />}
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
