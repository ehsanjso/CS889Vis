import React from "react";
import KIRIN from "../assets/img/Kirin.png";
import "../styles/components/logo.scss";

export default function Logo() {
  return (
    <div className="logo">
      <img src={KIRIN} alt="kirin" />
    </div>
  );
}
