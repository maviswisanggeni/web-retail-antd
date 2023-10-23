import React from "react";
import "../../styles/stock-in.css";
import TblStockOut from "../../components/TblStockOut";

const StockOut: React.FC = () => {
  return (
    <div className="content">
      <TblStockOut />
    </div>
  );
};

export default StockOut;
