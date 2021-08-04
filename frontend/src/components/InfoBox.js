import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import "../styles/components/info-box.scss";

const InfoBox = ({ time }) => (
  <div className="info-box">
    <div className="info-box-detail">
      <p>
        <ClockCircleOutlined />
        {time}
      </p>
    </div>
  </div>
);

export default InfoBox;
