import React from "react";
import "../styles/components/loading.scss";

const Loading = () => (
  <div className="loading">
    <span className="square loading-indicator">
      <span className="square-inner" />
    </span>
  </div>
);

export default Loading;
