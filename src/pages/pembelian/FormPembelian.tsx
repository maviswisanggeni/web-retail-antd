import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface PembelianEntity {
  supplier: string;
  namaProduk: string;
  jumlah: number;
  biaya: number;
}

const FormPembelian: React.FC = () => {
  const [form] = Form.useForm();
  const [pembelian, setPembelian] = useState<PembelianEntity[]>([]);
  const [produkBaru, setProdukBaru] = useState<PembelianEntity>({
    supplier: "",
    namaProduk: "",
    jumlah: 0,
    biaya: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PembelianEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<PembelianEntity | null>(null); // Mendeklarasikan editRecord sebagai variabel state
  const [supplierData, setSupplierData] = useState<string[]>([]);
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabKey, setTabKey] = useState("1");

  useEffect(() => {
    axios.get("url-api-anda").then((response) => {
      const fetchedSupplierData = response.data;
      setSupplierData(fetchedSupplierData);
    });

    const savedPembelian = JSON.parse(localStorage.getItem("pembelian") || "[]");
    setPembelian(savedPembelian);
  }, []);

  useEffect(() => {
    localStorage.setItem("pembelian", JSON.stringify(pembelian));
  }, [pembelian]);

  const handleTambahPembelian = () => {
    if (!produkBaru.supplier || !produkBaru.namaProduk || produkBaru.jumlah <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const biaya = produkBaru.jumlah * 100;
    const pembelianDenganBiaya = { ...produkBaru, biaya };

    setPembelian([...pembelian, pembelianDenganBiaya]);

    setProdukBaru({
      supplier: "",
      namaProduk: "",
      jumlah: 0,
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

    const pembelianDiperbarui = pembelian.map((item) =>
      item === editRecord ? { ...item, ...produkBaru } : item
    );
    setPembelian(pembelianDiperbarui);
    setIsEditModalVisible(false);
    setProdukBaru({
      supplier: "",
      namaProduk: "",
      jumlah: 0,
      biaya: 0,
    });
  };

  const columns = [
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
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
      title: "Total Biaya",
      dataIndex: "biaya",
      key: "biaya",
    },
    {
      title: "Tindakan",
      key: "tindakan",
      render: (text: any, record: PembelianEntity) => (
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
            onConfirm={() => handleHapusPembelian(record)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="default" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleHapusPembelian = (record: PembelianEntity) => {
    const pembelianDiperbarui = pembelian.filter((item) => item !== record);
    setPembelian(pembelianDiperbarui);
    setIsEditModalVisible(false);
  };

  const handleDetail = (record: PembelianEntity) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  const handleEdit = (record: PembelianEntity) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const getTotalBiaya = () => {
    return pembelian.reduce((total, pembelian) => total + pembelian.biaya, 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pembelian);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pembelian");

    XLSX.writeFile(workbook, "pembelian.xlsx");
  };

  return (
    <div className="content">
      <Title>Transaksi Pembelian</Title>
      <Tabs defaultActiveKey="1" activeKey={tabKey} onChange={handleTabChange}>
        <TabPane tab="Daftar Pembelian" key="1">
          <Button type="primary" onClick={showModal}>
            Tambah Data
          </Button>

          <Modal
            title="Tambah Data Pembelian"
            visible={isModalVisible}
            onOk={handleTambahPembelian}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="Supplier" name="supplier">
                <Select
                  value={produkBaru.supplier}
                  onChange={(value) => setProdukBaru({ ...produkBaru, supplier: value })}
                >
                  {supplierData.map((supplier) => (
                    <Option key={supplier} value={supplier}>
                      {supplier}
                    </Option>
                  ))}
                </Select>
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
            </Form>
          </Modal>

          <Button
            type="primary"
            onClick={exportToExcel}
            style={{ margin: "5px", background: "#008000", border: "none" }}
          >
            Ekspor ke Excel
          </Button>

          <Table columns={columns} dataSource={pembelian} style={{ margin: "8px" }} />
        </TabPane>
      </Tabs>

      <div>
        <strong>Total Biaya: {getTotalBiaya()}</strong>
      </div>

      <Modal
        title="Detail Pembelian"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {/* Konten untuk modal "Detail Pembelian" */}
      </Modal>

      <Modal
        title="Edit Pembelian"
        visible={isEditModalVisible}
        onOk={handleSimpanEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {/* Konten untuk modal "Edit Pembelian" */}
        <Form form={form} layout="vertical">
          <Form.Item label="Supplier" name="supplier">
            <Select
              value={produkBaru.supplier}
              onChange={(value) => setProdukBaru({ ...produkBaru, supplier: value })}
            >
              {supplierData.map((supplier) => (
                <Option key={supplier} value={supplier}>
                  {supplier}
                </Option>
              ))}
            </Select>
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
        </Form>
      </Modal>
    </div>
  );
};

export default FormPembelian;
