import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  PieChartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, MenuProps } from "antd";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "../../styles/dashboard.css";
import FormPenjualan from "../penjualan/FormPenjualan";
import FormPembelian from "../pembelian/FormPembelian";
import Gudang from "../gudang/Gudang";
import Title from "antd/es/typography/Title";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem(<Link to="/">Dashboard</Link>, '1', <HomeOutlined />),
  getItem('Penjualan', '2', <PieChartOutlined />, [
    getItem(<Link to="/penjualan/post">Buat Penjualan</Link>, '2-1'),
  ]),
  getItem('Pembelian', '3', <PieChartOutlined />, [
    getItem(<Link to="/pembelian/post">Buat Pembelian</Link>, '3-1'),
  ]),
  getItem(<Link to="/gudang">Gudang</Link>, '4', <InboxOutlined />),
];

const DashboardComponent: React.FC = () => (
  <div style={{ textAlign: "center" }}>
    <Title>Dashboard</Title>
  </div>
);

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout className="container">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Header
            className="header"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Web Retail Team 3
          </Header>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}  
            defaultOpenKeys={['1']}
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardComponent />} />
              <Route
                path="/penjualan/post"
                element={<FormPenjualan />}
              />
              <Route
                path="/pembelian/post"
                element={<FormPembelian />}
              />
              <Route path="/gudang" element={<Gudang />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Dashboard;
