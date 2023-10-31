import Title from "antd/es/typography/Title";
import React from "react";
import Adjustment from "../../components/Adjustment";
import DetailAdjustment from "../../components/DetailAdjustment";

const Stock: React.FC = () => {
  return (
    <div className="content">
        <Title level={2}>Penyesuaian Stock</Title>
        <Adjustment />
    </div>
  );
};

export default Stock;
