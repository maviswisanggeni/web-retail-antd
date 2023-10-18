import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

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
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProductsEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<ProductsEntity | null>(null);

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

  const handleDetail = (record: ProductsEntity) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record: ProductsEntity) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
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
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => handleDetail(record)}
          >
            Detail
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
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
      <Modal
        title="Detail Pembelian"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {selectedRecord && (
          <div>
            <p>Sales: {selectedRecord.sales}</p>
            <p>Customer: {selectedRecord.customer}</p>
            {/* Add more details here if needed */}
          </div>
        )}
      </Modal>
      <Modal
        title="Edit Pembelian"
        visible={isEditModalVisible}
        onOk={() => setIsEditModalVisible(false)}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {/* Edit form for the selected record */}
      </Modal>
    </div>
  );
};

export default FormPembelian;
