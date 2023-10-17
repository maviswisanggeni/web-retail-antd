import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Define the ProductsEntity type here
interface ProductsEntity {
  productName: string;
  quantity: number;
  // Add other properties if needed
}

const FormPenjualan: React.FC = () => {
  const [form] = Form.useForm();
  const [purchases, setPurchases] = useState<ProductsEntity[]>([]); // Specify the type
  const [newPurchase, setNewPurchase] = useState<ProductsEntity>({
    productName: "",
    quantity: 0,
  });

  useEffect(() => {
    // Load purchases from your data source or API
  }, []);

  const handleAddPurchase = () => {
    setPurchases([...purchases, newPurchase]);
    setNewPurchase({ productName: "", quantity: 0 });
    form.resetFields();
  };

  const handleDeletePurchase = (record: ProductsEntity) => {
    const updatedPurchases = purchases.filter((item) => item !== record);
    setPurchases(updatedPurchases);
  };

  const columns = [
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
      title: "Actions",
      key: "actions",
      render: (text: any, record: ProductsEntity) => (
        <Space size="small">
          <Popconfirm
            title="Are you sure to delete this purchase?"
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
      <Title>Penjualan</Title>
      <Form form={form} layout="inline">
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
        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPurchase}>
            Tambah Penjualan
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={purchases} />
    </div>
  );
};

export default FormPenjualan;
