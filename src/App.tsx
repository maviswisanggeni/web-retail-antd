import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPembelian from "./pages/pembelian/FormPembelian";
import FormPenjualan from "./pages/penjualan/FormPenjualan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pembelian" element={<FormPembelian />} />
        <Route path="/penjualan" element={<FormPenjualan />} />
      </Routes>
    </Router>
  );
}

export default App;
