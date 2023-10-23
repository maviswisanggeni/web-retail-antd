import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";

const { Title } = Typography;
const { Option } = Select;

interface SalesEntity {
  salesPerson: string;
  productName: string;
  quantity: number;
  customer: string;
  revenue: number;
}

const FormPenjualan: React.FC = () => {
  const [form] = Form.useForm();
  const [sales, setSales] = useState<SalesEntity[]>([]);
  const [newSale, setNewSale] = useState<SalesEntity>({
    salesPerson: "",
    productName: "",
    quantity: 0,
    customer: "",
    revenue: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalesEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<SalesEntity | null>(null);
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);

  useEffect(() => {

    axios.get("your-api-url-for-sales").then((response) => {
      const fetchedSalesData = response.data;
      setSales(fetchedSalesData);
    });

  
    const savedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    setSales(savedSales);
  }, []);

  useEffect(() => {

    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = () => {
    if (!newSale.salesPerson || !newSale.productName || newSale.quantity <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const revenue = newSale.quantity * 100;
    const saleWithRevenue = { ...newSale, revenue };

    setSales([...sales, saleWithRevenue]);

    setNewSale({
      salesPerson: "",
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

    setIsEditModalVisible(false);
  };

  const handleDetail = (record: SalesEntity) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record: SalesEntity) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.revenue, 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    XLSX.writeFile(workbook, "sales.xlsx");
  };

  const columns = [
    {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: SalesEntity) => (
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
            title="Are you sure to delete this data?"
            onConfirm={() => handleDeleteSale()}
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
      <Title>Transaksi Penjualan</Title>

      <Form form={form} layout="inline">
        <Form.Item label="Sales Person" name="salesPerson">
          <Input
            value={newSale.salesPerson}
            onChange={(e) => setNewSale({ ...newSale, salesPerson: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Product Name" name="productName">
          <Input
            value={newSale.productName}
            onChange={(e) => setNewSale({ ...newSale, productName: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Quantity" name="quantity">
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
          <Button type="primary" onClick={handleAddSale}>
            + Add Data
          </Button>
          {emptyDataWarning && (
            <span style={{ color: "red", marginLeft: 10 }}>Data kosong</span>
          )}
        </Form.Item>
      </Form>

      <Button type="primary" onClick={exportToExcel} style={{ margin: "5px", background: "#008000", border: "none" }}>
  Export to Excel
</Button>

      <Table columns={columns} dataSource={sales} style={{ margin: "8px" }} />
      <div>
        <strong>Total Revenue: {getTotalRevenue()}</strong>
      </div>

      <Modal
        title="Detail Penjualan"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {/* ... (modal content) */}
      </Modal>

      <Modal
        title="Edit Penjualan"
        visible={isEditModalVisible}
        onOk={handleEditSale}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {/* ... (edit modal content) */}
        <Button type="default" onClick={handleDeleteSale}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};

export default FormPenjualan;
