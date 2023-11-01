import React from "react";
import TblSupplier from "../../components/TblSupplier";
import Title from "antd/es/typography/Title";

const Supplier: React.FC = () => {
  return (
    <div className="content">
      <Title level={2}>Data Supplier</Title>
      <TblSupplier />
    </div>
  );
};

export default Supplier;
