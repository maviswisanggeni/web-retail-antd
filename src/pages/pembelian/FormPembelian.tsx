import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";
import Products from "../../components/Products";

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
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);

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
    if (!newPurchase.sales || !newPurchase.productName || newPurchase.quantity <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const cost = newPurchase.quantity * 100;
    const purchaseWithCost = { ...newPurchase, cost };

    setPurchases([...purchases, purchaseWithCost]);

    setNewPurchase({
      sales: "",
      productName: "",
      quantity: 0,
      customer: "",
      cost: 0,
    });

    form.resetFields();
    setEmptyDataWarning(false);
  };

  const handleEditPurchase = () => {
    if (!editRecord) {
      return;
    }

    setIsEditModalVisible(false);
  };

  const handleDeletePurchase = () => {
    if (!editRecord) {
      return;
    }

    const updatedPurchases = purchases.filter((item) => item !== editRecord);
    setPurchases(updatedPurchases);
    setIsEditModalVisible(false);
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(purchases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");

    XLSX.writeFile(workbook, "purchases.xlsx");
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
            onConfirm={() => handleDeletePurchase()}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" icon={<DeleteOutlined />} />
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
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, quantity: parseInt(e.target.value) || 0 })
            }
          />
        </Form.Item>
        <Form.Item label="Customer" name="customer">
          <Input
            value={newPurchase.customer}
            onChange={(e) => setNewPurchase({ ...newPurchase, customer: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddPurchase}style={{margin:10}}>
            Tambah Data
          </Button>
          {emptyDataWarning && (
            <span style={{ color: "red", marginLeft: 10 }}>Data kosong</span>
          )}
        </Form.Item>
      </Form>

      <Button type="primary" onClick={exportToExcel} style={{ margin: "5px", background: "#008000", border: "none" }}>
        Export to Excel
      </Button>

      <Table columns={columns} dataSource={purchases} style={{ margin: "8px" }} />
      <div>
        <strong>Total Biaya: {getTotalCost()}</strong>
      </div>

      <Modal
        title="Detail Pembelian"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {}
      </Modal>

      <Modal
        title="Edit Pembelian"
        visible={isEditModalVisible}
        onOk={handleEditPurchase}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {}
        <Button type="default" onClick={handleDeletePurchase}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};

export default FormPembelian;
