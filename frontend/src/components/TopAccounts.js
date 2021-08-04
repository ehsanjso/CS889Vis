import React from "react";
import { Table, Space } from "antd";
import { Link } from "react-router-dom";
import "../styles/components/top-accounts.scss";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <Link to={`/search/${record.address}`}>Show Account</Link>
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "Vitalik Buterin – Founder of Ethereum",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  },
  {
    key: "2",
    name: "A16z – Famous investor",
    address: "0x05e793ce0c6027323ac150f6d45c2344d28b6019",
  },
  {
    key: "3",
    name: "Kain Warwick – Founder of Synthetix",
    address: "0x42f9134E9d3Bf7eEE1f8A5Ac2a4328B059E7468c",
  },
  {
    key: "4",
    name: "Robert Leshner - Founder of Compound",
    address: "0x88FB3D509fC49B515BFEb04e23f53ba339563981",
  },
  {
    key: "5",
    name: "Alameda Research (SBF)– Famous investor",
    address: "0x477573f212A7bdD5F7C12889bd1ad0aA44fb82aa",
  },
  {
    key: "6",
    name: "Top Degen 1",
    address: "0x57757e3d981446d585af0d9ae4d7df6d64647806",
  },
  {
    key: "7",
    name: "Top Degen 2",
    address: "0x46499275b5c4d67dfa46b92d89aada3158ea392e",
  },
  {
    key: "8",
    name: "Top Degen 3",
    address: "0x57ef012861c4937a76b5d6061be800199a2b9100",
  },
  {
    key: "9",
    name: "Top Degen 4",
    address: "0x6cfac3cf77a359d7ce28c14f2d53de48981e0f04",
  },
  {
    key: "10",
    name: "Top Degen 5",
    address: "0xf486d56cce70c481b3455af901fcc4f03fee8107",
  },
  {
    key: "11",
    name: "Top Degen 6",
    address: "0xc31db2e710192791b65de43d4b84886a6d770322",
  },
  {
    key: "12",
    name: "Top Degen 7",
    address: "0x554b1bd47b7d180844175ca4635880da8a3c70b9",
  },
  {
    key: "13",
    name: "Top Degen 8",
    address: "0x951b6d50d07c39b0f97a7bb2f5c1e96f07a093d3",
  },
  {
    key: "14",
    name: "Top Degen 9",
    address: "0x71f9ccd68bf1f5f9b571f509e0765a04ca4ffad2",
  },
];

export default function TopAccounts({ show }) {
  return (
    <div className={`top-accounts ${show ? "visible" : ""}`}>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}
