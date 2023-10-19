import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

interface ProductsEntity {
  sales: string;
  productName: string;
  quantity: number;
  customer: string;
  cost: number;
}

const FormPembelian: React.FC = () => {
  const [form] = Form.useForm();
  const [purchases, setPurchases] = useState<ProductsEntity[]>([]);
  const [newPurchase, setNewPurchase] = useState<ProductsEntity>({
    sales: "",
    productName: "",
    quantity: 0,
    customer: "",
    cost: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProductsEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<ProductsEntity | null>(null);
  const [salesData, setSalesData] = useState<string[]>([]);

  useEffect(() => {
    axios.get("your-api-url").then((response) => {
      const fetchedSalesData = response.data;
      setSalesData(fetchedSalesData);
    });

    const savedPurchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    setPurchases(savedPurchases);
  }, []);

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  const handleAddPurchase = () => {

    const cost = newPurchase.quantity * 100;
    const purchaseWithCost = { ...newPurchase, cost };

    setPurchases([...purchases, purchaseWithCost]);
    setNewPurchase({ ...newPurchase, sales: "", cost: 0 });
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

  const getTotalCost = () => {
    return purchases.reduce((total, purchase) => total + purchase.cost, 0);
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
      title: "Total Biaya",
      dataIndex: "cost",
      key: "cost",
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
      <Title>Transaksi Pembelian</Title>
      <Form form={form} layout="inline">
        <Form.Item label="Sales" name="sales">
          <Select
            value={newPurchase.sales}
            onChange={(value) => setNewPurchase({ ...newPurchase, sales: value })}
          >
            {salesData.map((sale, index) => (
              <Option key={index} value={sale}>
                {sale}
              </Option>
            ))}
          </Select>
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
      <div>
        <strong>Total Biaya: {getTotalCost()}</strong>
      </div>
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
