import React from "react";
import { Input, Button } from "antd";
import Logo from "./Logo";
import "../styles/components/search.scss";

export default function Search() {
  return (
    <div className="search">
      <div className="search-box">
        <Logo />
        <Input size="large" />
        <div className="search-btns">
          <Button type="primary">Search</Button>
          <Button>Top Accounts</Button>
        </div>
      </div>
    </div>
  );
}
