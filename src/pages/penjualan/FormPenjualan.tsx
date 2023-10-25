import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";
import Products from "../../components/Products";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ProdukEntity {
  sales: string;
  namaProduk: string;
  jumlah: number;
  pelanggan: string;
  biaya: number;
}

const FormPenjualan: React.FC = () => {
  const [form] = Form.useForm();
  const [penjualan, setPenjualan] = useState<ProdukEntity[]>([]);
  const [produkBaru, setProdukBaru] = useState<ProdukEntity>({
    sales: "",
    namaProduk: "",
    jumlah: 0,
    pelanggan: "",
    biaya: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProdukEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<ProdukEntity | null>(null); // Mendeklarasikan editRecord sebagai variabel state
  const [salesData, setSalesData] = useState<string[]>([]);
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabKey, setTabKey] = useState("1");

  useEffect(() => {
    axios.get("url-api-anda").then((response) => {
      const fetchedSalesData = response.data;
      setSalesData(fetchedSalesData);
    });

    const savedPenjualan = JSON.parse(localStorage.getItem("penjualan") || "[]");
    setPenjualan(savedPenjualan);
  }, []);

  useEffect(() => {
    localStorage.setItem("penjualan", JSON.stringify(penjualan));
  }, [penjualan]);

  const handleTambahPenjualan = () => {
    if (!produkBaru.sales || !produkBaru.namaProduk || produkBaru.jumlah <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const biaya = produkBaru.jumlah * 100;
    const penjualanDenganBiaya = { ...produkBaru, biaya };

    setPenjualan([...penjualan, penjualanDenganBiaya]);

    setProdukBaru({
      sales: "",
      namaProduk: "",
      jumlah: 0,
      pelanggan: "",
      biaya: 0,
    });

    form.resetFields();
    setEmptyDataWarning(false);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTabChange = (key: string) => {
    setTabKey(key);
  };


  const handleSimpanEdit = () => {
    if (!editRecord) {
      return;
    }

    const penjualanDiperbarui = penjualan.map((item) =>
      item === editRecord ? { ...item, ...produkBaru } : item
    );
    setPenjualan(penjualanDiperbarui);
    setIsEditModalVisible(false);
    setProdukBaru({
      sales: "",
      namaProduk: "",
      jumlah: 0,
      pelanggan: "",
      biaya: 0,
    });
  };

  const columns = [
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Nama Produk",
      dataIndex: "namaProduk",
      key: "namaProduk",
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
    },
    {
      title: "Pelanggan",
      dataIndex: "pelanggan",
      key: "pelanggan",
    },
    {
      title: "Total Biaya",
      dataIndex: "biaya",
      key: "biaya",
    },
    {
      title: "Tindakan",
      key: "tindakan",
      render: (text: any, record: ProdukEntity) => (
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
            onConfirm={() => handleHapusPenjualan(record)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="default" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleHapusPenjualan = (record: ProdukEntity) => {
    const penjualanDiperbarui = penjualan.filter((item) => item !== record);
    setPenjualan(penjualanDiperbarui);
    setIsEditModalVisible(false);
  };

  const handleDetail = (record: ProdukEntity) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record: ProdukEntity) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const getTotalBiaya = () => {
    return penjualan.reduce((total, penjualan) => total + penjualan.biaya, 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(penjualan);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penjualan");

    XLSX.writeFile(workbook, "penjualan.xlsx");
  };

  return (
    <div className="content">
      <Title>Transaksi Penjualan</Title>
      <Tabs defaultActiveKey="1" activeKey={tabKey} onChange={handleTabChange}>
        <TabPane tab="Daftar Penjualan" key="1">
          <Button type="primary" onClick={showModal}>
            Tambah Data
          </Button>

          <Modal
            title="Tambah Data Penjualan"
            visible={isModalVisible}
            onOk={handleTambahPenjualan}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="Sales" name="sales">
                <Input
                  value={produkBaru.sales}
                  onChange={(e) => setProdukBaru({ ...produkBaru, sales: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Nama Produk" name="namaProduk">
                <Input
                  value={produkBaru.namaProduk}
                  onChange={(e) => setProdukBaru({ ...produkBaru, namaProduk: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Jumlah" name="jumlah">
                <Input
                  type="number"
                  value={produkBaru.jumlah}
                  onChange={(e) =>
                    setProdukBaru({ ...produkBaru, jumlah: parseInt(e.target.value) || 0 })
                  }
                />
              </Form.Item>
              <Form.Item label="Pelanggan" name="pelanggan">
                <Input
                  value={produkBaru.pelanggan}
                  onChange={(e) => setProdukBaru({ ...produkBaru, pelanggan: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="primary"
            onClick={exportToExcel}
            style={{ margin: "5px", background: "#008000", border: "none" }}
          >
            Ekspor ke Excel
          </Button>

          <Table columns={columns} dataSource={penjualan} style={{ margin: "8px" }} />
        </TabPane>
      </Tabs>

      <div>
        <strong>Total Biaya: {getTotalBiaya()}</strong>
      </div>

      <Modal
        title="Detail Penjualan"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {/* Konten untuk modal "Detail Penjualan" */}
      </Modal>

      <Modal
        title="Edit Penjualan"
        visible={isEditModalVisible}
        onOk={handleSimpanEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {/* Konten untuk modal "Edit Penjualan" */}
        <Form form={form} layout="vertical">
          <Form.Item label="Sales" name="sales">
            <Input
              value={produkBaru.sales}
              onChange={(e) => setProdukBaru({ ...produkBaru, sales: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Nama Produk" name="namaProduk">
            <Input
              value={produkBaru.namaProduk}
              onChange={(e) => setProdukBaru({ ...produkBaru, namaProduk: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Jumlah" name="jumlah">
            <Input
              type="number"
              value={produkBaru.jumlah}
              onChange={(e) =>
                setProdukBaru({ ...produkBaru, jumlah: parseInt(e.target.value) || 0 })
              }
            />
          </Form.Item>
          <Form.Item label="Pelanggan" name="pelanggan">
            <Input
              value={produkBaru.pelanggan}
              onChange={(e) => setProdukBaru({ ...produkBaru, pelanggan: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormPenjualan;
