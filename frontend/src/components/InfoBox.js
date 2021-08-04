import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import "../styles/components/info-box.scss";

const InfoBox = ({ time, icon = true }) => (
  <div className="info-box">
    <div className="info-box-detail">
      <p>
        {icon && <ClockCircleOutlined />}
        {time}
      </p>
    </div>
  </div>
);

export default InfoBox;
