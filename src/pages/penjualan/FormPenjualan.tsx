import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";

const { Title } = Typography;
const { Option } = Select;

interface PenjualanEntity {
  sales: string;
  productName: string;
  quantity: number;
  customer: string;
  revenue: number;
}

const FormPenjualan: React.FC = () => {
  const [form] = Form.useForm();
  const [sales, setSales] = useState<PenjualanEntity[]>([]);
  const [newSale, setNewSale] = useState<PenjualanEntity>({
    sales: "",
    productName: "",
    quantity: 0,
    customer: "",
    revenue: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PenjualanEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<PenjualanEntity | null>(null);
  const [productsData, setProductsData] = useState<string[]>([]);
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);

  useEffect(() => {
    axios.get("your-api-url-for-sales").then((response) => {
      const fetchedProductsData = response.data;
      setProductsData(fetchedProductsData);
    });

    const savedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    setSales(savedSales);
  }, []);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = () => {
    if (!newSale.sales || !newSale.productName || newSale.quantity <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const revenue = newSale.quantity * 100;
    const saleWithRevenue = { ...newSale, revenue };

    setSales([...sales, saleWithRevenue]);

    setNewSale({
      sales: "",
      productName: "",
      quantity: 0,
      customer: "",
      revenue: 0,
    });

    form.resetFields();
    setEmptyDataWarning(false);
  };

  const handleEditSale = () => {
    if (!editRecord) {
      return;
    }

    setIsEditModalVisible(false);
  };

  const handleDeleteSale = () => {
    if (!editRecord) {
      return;
    }

    const updatedSales = sales.filter((item) => item !== editRecord);
    setSales(updatedSales);
    setIsEditModalVisible(false);
  };

  const handleDetail = (record: PenjualanEntity) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record: PenjualanEntity) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.revenue, 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penjualan");

    XLSX.writeFile(workbook, "penjualan.xlsx");
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
      title: "Total Pendapatan",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Aksi",
      key: "actions",
      render: (text: any, record: PenjualanEntity) => (
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
            onConfirm={() => handleDeleteSale()}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="default" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="content">
      <Title>Transaksi Penjualan</Title>

      <Form form={form} layout="inline">
        <Form.Item label="Sales" name="sales">
          <Input
            value={newSale.sales}
            onChange={(e) => setNewSale({ ...newSale, sales: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Nama Produk" name="productName">
  <Input
    value={newSale.productName}
    onChange={(e) => setNewSale({ ...newSale, productName: e.target.value })}
  />
</Form.Item>
        <Form.Item label="Jumlah" name="quantity">
          <Input
            type="number"
            value={newSale.quantity}
            onChange={(e) =>
              setNewSale({ ...newSale, quantity: parseInt(e.target.value) || 0 })
            }
          />
        </Form.Item>
        <Form.Item label="Customer" name="customer">
          <Input
            value={newSale.customer}
            onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddSale}style={{margin:10}}>
            Tambah Data
          </Button>
          {emptyDataWarning && (
            <span style={{ color: "red", marginLeft: 10 }}>Data kosong</span>
          )}
        </Form.Item>
      </Form>

      <Button type="primary" onClick={exportToExcel} style={{ margin: "5px", background: "#008000", border: "none" }}>
        Ekspor Excel
      </Button>

      <Table columns={columns} dataSource={sales} style={{ margin: "8px" }} />
      <div>
        <strong>Total Pendapatan: {getTotalRevenue()}</strong>
      </div>

      <Modal
        title="Detail Penjualan"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {}
      </Modal>

      <Modal
        title="Edit Penjualan"
        visible={isEditModalVisible}
        onOk={handleEditSale}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {}
        <Button type="default" onClick={() => handleDeleteSale()}>
          Hapus
        </Button>
      </Modal>
    </div>
  );
};

export default FormPenjualan;
