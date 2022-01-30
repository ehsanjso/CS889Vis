import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { host } from "../actions/consts/host";
import * as d3 from "d3";
import Loading from "./Loading";
import "../styles/components/portfolio.scss";

const chartSettings = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 20,
  marginLeft: 50,
};

export default function Portfolio({ address }) {
  const [ref, dms] = useChartDimensions(chartSettings);
  const [data, setData] = useState();
  const [fetchInProg, setFetchInProg] = useState(false);
  const refSvg = useRef();

  const f = d3.format("+,d");

  useEffect(() => {
    const fetchData = async () => {
      setFetchInProg(true);
      const body = {
        address: address,
      };
      const result = await axios.post(`${host}/activity/address`, body);
      setData(result.data);
      setFetchInProg(false);
    };
    if (address) {
      fetchData();
    }
  }, [address]);

  useEffect(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0 && data) {
      // 1. Access data
      let dataset = [...data.protocol];
      const barHeight = 25;
      const height =
        Math.ceil((dataset.length + 0.1) * barHeight) +
        dms.marginTop +
        dms.marginBottom;
      const marginTop = (400 - height) / 2;
      const width = 400;
      const format = d3.format("+,d");
      const tickFormat = d3.formatPrefix("+.2", 1e6);
      const x = d3
        .scaleLinear()
        .domain(d3.extent(dataset, (d) => d.asset))
        .rangeRound([dms.marginLeft, width - dms.marginRight]);

      const y = d3
        .scalePoint()
        .domain(d3.range(dataset.length))
        .rangeRound([dms.marginTop, height - dms.marginBottom])
        .padding(0.1);

      const xAxis = (g) =>
        g
          .attr("transform", `translate(0,${dms.marginTop - 5})`)
          .call(
            d3
              .axisTop(x)
              .ticks(width / 80)
              .tickFormat(tickFormat)
          )
          .call((g) => g.select(".domain").remove());

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${x(0)},0)`)
          .call(
            d3
              .axisLeft(y)
              .tickFormat((i) => dataset[i].name)
              .tickSize(0)
              .tickPadding(35)
          )
          .call((g) => g.select(".domain").attr("stroke", "#C9D6DF"));

      // 3. Draw canvas
      const wrapper = d3.select(refSvg.current);

      const bounds = wrapper
        .append("g")
        .attr("class", "bound")
        .style(
          "transform",
          `translate(${dms.marginLeft}px, ${dms.marginTop + marginTop + 5}px)`
        );

      bounds
        .append("g")
        .call(xAxis)
        .selectAll(".tick line")
        .each(function (d, i) {
          d3.select(this)
            .attr("y2", height - dms.marginBottom + 5)
            .attr("stroke", "#F0F5F9");
        });

      bounds
        .append("g")
        .call(yAxis)
        .selectAll(".tick")
        .each(function (d, i) {
          d3.select(this)
            .append("image")
            .attr("xlink:href", dataset[d].logo_url)
            .attr("x", 0 - 30)
            .attr("y", 0 - 8)
            .attr("width", 16)
            .attr("height", 16);
        });

      bounds
        .append("g")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .selectAll("line")
        .data(dataset)
        .join("line")
        .attr("x1", x(0) + 1)
        .attr("x2", (d) => x(d.asset))
        .attr("y1", (d, i) => y(i))
        .attr("y2", (d, i) => y(i));

      bounds
        .append("g")
        .selectAll("circle")
        .data(dataset)
        .join("circle")
        .attr("cx", (d) => x(d.asset))
        .attr("cy", (d, i) => y(i))
        .attr("r", 6)
        .style("fill", "#69b3a2");
      // .attr("stroke", "black");

      bounds
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(dataset)
        .join("text")
        .attr("text-anchor", (d) => (d.asset < 0 ? "end" : "start"))
        .attr("x", (d) => x(d.asset) + Math.sign(d.asset - 0) * 8)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => format(d.asset));
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const svg = d3.select(refSvg.current);
      svg.selectAll("*").remove();
    };
  }, [
    dms.boundedHeight,
    dms.boundedWidth,
    dms.marginLeft,
    dms.marginTop,
    dms.marginBottom,
    dms.marginRight,
    data,
  ]);

  return (
    <div className={`portfolio ${address ? "visible" : ""}`}>
      {address && <h1 className="address">Address: {address}</h1>}
      <div className="portfolio-vis">
        <div className="portfolio-balance">
          <h1 className="balance-h">Balance</h1>
          {data && <h1 className="balance">{f(data.balance)}</h1>}
        </div>
        <div className="portfolio-tree" ref={ref}>
          <svg width={dms.width} height={dms.height} ref={refSvg}></svg>
        </div>
      </div>
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
