import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";

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

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(purchases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");
    
    // Generate an Excel file and trigger a download
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

      {/* Add the export button here */}
      <Button type="primary" onClick={exportToExcel}>
        Export to Excel
      </Button>

      <Form form={form} layout="inline">
        {/* ... (rest of your form code) */}
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
        {/* ... (modal content) */}
      </Modal>
      <Modal
        title="Edit Pembelian"
        visible={isEditModalVisible}
        onOk={() => setIsEditModalVisible(false)}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {/* ... (edit modal content) */}
      </Modal>
    </div>
  );
};

export default FormPembelian;
