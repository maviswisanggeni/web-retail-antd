import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  PieChartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "../../styles/dashboard.css";
import FormPenjualan from "../penjualan/FormPenjualan";
import FormPembelian from "../pembelian/FormPembelian";
import Gudang from "../gudang/Gudang";
import Title from "antd/es/typography/Title";

const { Header, Sider, Content } = Layout;

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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item
              key="1"
              icon={
                <Link to="/">
                  <HomeOutlined />
                </Link>
              }
            >
              Dashboard
            </Menu.Item>
            <Menu.SubMenu key="2" icon={<PieChartOutlined />} title="Penjualan">
              <Menu.Item key="2-1" itemIcon={<Link
                to="/penjualan/post"
              >
              </Link>}>
                Buat Penjualan
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="3" icon={<PieChartOutlined />} title="Pembelian">
              <Menu.Item key="3-1" itemIcon={<Link
                to="/pembelian/post"
              >
              </Link>}>
                Buat Pembelian
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key="4"
              icon={
                <Link to="/gudang">
                  <InboxOutlined />
                </Link>
              }
            >
              Gudang
            </Menu.Item>
          </Menu>
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
