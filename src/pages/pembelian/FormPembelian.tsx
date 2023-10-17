import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface ProductsEntity {
  sales: string;
  productName: string;
  quantity: number;
  customer: string;
}

const FormPembelian: React.FC = () => {
  const [form] = Form.useForm();
  const [purchases, setPurchases] = useState<ProductsEntity[]>([]);
  const [newPurchase, setNewPurchase] = useState<ProductsEntity>({
    sales: "",
    productName: "",
    quantity: 0,
    customer: "",
  });

  useEffect(() => {
    // API
  }, []);

  const handleAddPurchase = () => {
    setPurchases([...purchases, newPurchase]);
    setNewPurchase({ sales: "", productName: "", quantity: 0, customer: "" });
    form.resetFields();
  };

  const handleDeletePurchase = (record: ProductsEntity) => {
    const updatedPurchases = purchases.filter((item) => item !== record);
    setPurchases(updatedPurchases);
  };

  const columns = [
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Nama Produk",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Jumlah",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: ProductsEntity) => (
        <Space size="small">
          <Popconfirm
            title="Yakin Hapus Data?"
            onConfirm={() => handleDeletePurchase(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="content">
      <Title>Pembelian</Title>
      <Form form={form} layout="inline">
        <Form.Item label="Sales" name="sales">
          <Input
            value={newPurchase.sales}
            onChange={(e) => setNewPurchase({ ...newPurchase, sales: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Nama Produk" name="productName">
          <Input
            value={newPurchase.productName}
            onChange={(e) => setNewPurchase({ ...newPurchase, productName: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Jumlah" name="quantity">
          <Input
            type="number"
            value={newPurchase.quantity}
            onChange={(e) => setNewPurchase({ ...newPurchase, quantity: parseInt(e.target.value) })}
          />
        </Form.Item>
        <Form.Item label="Customer" name="customer">
          <Input
            value={newPurchase.customer}
            onChange={(e) => setNewPurchase({ ...newPurchase, customer: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPurchase}>
            Tambah Pembelian
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={purchases} />
    </div>
  );
};

export default FormPembelian;
