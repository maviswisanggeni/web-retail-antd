import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    console.log("Logging in with username:", username, "and password:", password);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Title>Login</Title>
          <Form onFinish={handleLogin}>
            <Form.Item name="username" rules={[{ required: true, message: "Please enter your username" }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Login;
