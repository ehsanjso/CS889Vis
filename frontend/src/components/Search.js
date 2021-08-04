import React, { useState } from "react";
import axios from "axios";
import { host } from "../actions/consts/host";
import { Input, Button, message } from "antd";
import { history } from "../routers/AppRouter";
import Logo from "./Logo";
import "../styles/components/search.scss";
import Portfolio from "./Portfolio";
import TopAccounts from "./TopAccounts";

export default function Search({ match }) {
  const topAccount = match.params.address === "top-accounts";
  const [address, setAddress] = useState(undefined);
  const portfolioAddress = topAccount ? undefined : match.params.address;

  const onSearch = async () => {
    const body = {
      address: address,
    };
    try {
      const result = await axios.post(`${host}/activity/address`, body);
      setAddress(undefined);
      history.push(`/search/${address}`);
    } catch (error) {
      message.error("Address is not valid!");
    }
  };

  const onChange = (event) => {
    const val = event.target.value;
    setAddress(val);
    history.push(`/search`);
  };

  const onTop = () => {
    history.push(`/search/top-accounts`);
  };

  return (
    <div className="search">
      <Portfolio address={portfolioAddress} />
      <TopAccounts show={topAccount} />

      <div
        className={`search-box ${
          portfolioAddress || topAccount ? "has-data" : ""
        }`}
      >
        <Logo />
        <Input size="large" value={address} onChange={onChange} />
        <div className="search-btns">
          <Button type="primary" onClick={onSearch}>
            Search
          </Button>
          <Button onClick={onTop}>Top Accounts</Button>
        </div>
      </div>
    </div>
  );
}
