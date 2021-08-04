import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/header.scss";

export default function Header() {
  return (
    <div className="header">
      <Link to="/">Metrics</Link>
      <Link to="/search">Account</Link>
    </div>
  );
}
