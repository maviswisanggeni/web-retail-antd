import Title from "antd/es/typography/Title";
import React from "react";
import { Form, DatePicker, Input, Select, InputNumber, Button, Row, Col } from "antd";

const { Option } = Select;

const FormAddStockIn: React.FC = () => {
  const handleSubmit = (values: unknown) => {
    // Lakukan sesuatu dengan nilai-nilai yang dikirimkan saat formulir disubmit
    console.log("Form values:", values);
  };

  return (
    <div className="form-stock-in">
      <Title level={2}>Tambah Stok Masuk</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tanggal Masuk" name="date">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Cari Produk" name="search">
              <Input />
            </Form.Item>
            <Form.Item label="Nama Produk" name="product-name">
              <Input 
                disabled={true}
              />
            </Form.Item>
            <Form.Item label="Satuan" name="unit">
              <Input 
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Stok Awal" name="first-stock">
              <Input 
                disabled={true}
              />
            </Form.Item>
            <Form.Item label="Pemasok Produk" name="supplier">
              <Select defaultValue={
                "-- Pilih Suplier --"
              }>
                <Option value="supplier1">Pemasok 1</Option>
                <Option value="supplier2">Pemasok 2</Option>
                <Option value="supplier3">Pemasok 3</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Keterangan" name="keterangan">
              <Input />
            </Form.Item>
            <Form.Item label="Jumlah Stok Masuk" name="stock">
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ float: "right" }}>
          <Button type="primary" style={{ marginRight: 16 }} htmlType="submit">
            Simpan
          </Button>
          <Button type="default" style={{ marginRight: 16 }}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormAddStockIn;
