import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token : {
        colorPrimary : "#5272F2",
        fontFamily : "Poppins"
      }
    }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
