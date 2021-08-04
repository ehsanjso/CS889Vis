import React, { useState } from "react";
import axios from "axios";
import { host } from "../actions/consts/host";
import { Input, Button, message } from "antd";
import { history } from "../routers/AppRouter";
import Logo from "./Logo";
import "../styles/components/search.scss";
import Portfolio from "./Portfolio";

export default function Search() {
  const [address, setAddress] = useState(undefined);
  const [portfolioAddress, setPortfolioAddress] = useState(undefined);
  const [data, setData] = useState();

  const onSearch = async () => {
    const body = {
      address: address,
    };
    try {
      const result = await axios.post(`${host}/activity/address`, body);
      setData(result.data);
      setAddress(undefined);
      setPortfolioAddress(address);
    } catch (error) {
      message.error("Address is not valid!");
    }
  };

  const onChange = (event) => {
    const val = event.target.value;
    setAddress(val);
  };

  return (
    <div className="search">
      <Portfolio data={data} address={portfolioAddress} />

      <div className={`search-box ${data ? "has-data" : ""}`}>
        <Logo />
        <Input size="large" value={address} onChange={onChange} />
        <div className="search-btns">
          <Button type="primary" onClick={onSearch}>
            Search
          </Button>
          <Button>Top Accounts</Button>
        </div>
      </div>
    </div>
  );
}
