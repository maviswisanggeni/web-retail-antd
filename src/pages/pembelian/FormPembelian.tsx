import React, { useState, useEffect } from "react";
import { Typography, Form, Input, Button, Table, Space, Popconfirm, Modal, Select, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import axios from "axios";
import XLSX from "xlsx";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface PembelianEntity {
  supplier: string;
  namaBarang: string;
  jumlah: number;
  biaya: number;
}

const FormPembelian: React.FC = () => {
  const [form] = Form.useForm();
  const [pembelian, setPembelian] = useState<PembelianEntity[]>([
    {
      supplier: "PT Haryanto",
      namaBarang: "Plastik",
      jumlah: 5,
      biaya: 500,
    },
    {
      supplier: "PT Cahaya Numerta",
      namaBarang: "Textile",
      jumlah: 3,
      biaya: 300,
    },
  ]);
  const [filteredPembelian, setFilteredPembelian] = useState<PembelianEntity[]>([]);
  const [barangBaru, setBarangBaru] = useState<PembelianEntity>({
    supplier: "",
    namaBarang: "",
    jumlah: 0,
    biaya: 0,
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PembelianEntity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<PembelianEntity | null>(null);
  const [supplierData, setSupplierData] = useState<string[]>(["Supplier ABC", "Supplier XYZ"]);
  const [emptyDataWarning, setEmptyDataWarning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // axios.get("url-api-anda").then((response) => {
    //   const fetchedSupplierData = response.data;
    //   setSupplierData(fetchedSupplierData);
    // });

    const savedPembelian = JSON.parse(localStorage.getItem("pembelian") || "[]");
    setPembelian(savedPembelian);
  }, []);

  useEffect(() => {
    localStorage.setItem("pembelian", JSON.stringify(pembelian));
  }, [pembelian]);

  const handleTambahPembelian = () => {
    if (!barangBaru.supplier || !barangBaru.namaBarang || barangBaru.jumlah <= 0) {
      setEmptyDataWarning(true);
      return;
    }

    const biaya = barangBaru.jumlah * 100;
    const pembelianDenganBiaya = { ...barangBaru, biaya };

    setPembelian([...pembelian, pembelianDenganBiaya]);

    setBarangBaru({
      supplier: "",
      namaBarang: "",
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
      item === editRecord ? { ...item, ...barangBaru } : item
    );
    setPembelian(pembelianDiperbarui);
    setIsEditModalVisible(false);
    setBarangBaru({
      supplier: "",
      namaBarang: "",
      jumlah: 0,
      biaya: 0,
    });
  };

  const handleSearch = () => {
    const filteredData = pembelian.filter((item) => {
      return (
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredPembelian(filteredData);
    setIsSearching(true);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setFilteredPembelian([]);
  };

  const generateFakturContent = (record: PembelianEntity) => {
    // Generate the faktur content using the record data
    return `
      <div>
        <h1>Faktur Pembelian</h1>
        <p><strong>Supplier:</strong> ${record.supplier}</p>
        <p><strong>Nama Barang:</strong> ${record.namaBarang}</p>
        <p><strong>Jumlah:</strong> ${record.jumlah}</p>
        <p><strong>Total Biaya:</strong> ${record.biaya}</p>
      </div>
    `;
  };

  const handlePrintFaktur = (record: PembelianEntity) => {
    if (record) {
      const fakturContent = generateFakturContent(record);
      const fakturWindow = window.open('', '_blank');
      if (fakturWindow) {
        fakturWindow.document.open();
        fakturWindow.document.write(fakturContent);
        fakturWindow.document.close();
        fakturWindow.print();
      }
    }
  };

  const columns = [
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Nama Barang",
      dataIndex: "namaBarang",
      key: "namaBarang",
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
          <Button
            type="default"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintFaktur(record)}
          >
            Print Faktur
          </Button>
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
    const dataToCalculate = isSearching ? filteredPembelian : pembelian;
    return dataToCalculate.reduce((total, pembelian) => total + pembelian.biaya, 0);
  };

  const exportToExcel = () => {
    const dataToExport = isSearching ? filteredPembelian : pembelian;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pembelian");

    XLSX.writeFile(workbook, "pembelian.xlsx");
  };

  return (
    <div className="content">
      <Title>Transaksi Pembelian</Title>
      <Tabs defaultActiveKey="1" activeKey={tabKey} onChange={handleTabChange}>
        <TabPane tab="Daftar Pembelian" key="1">
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button type="primary" onClick={handleResetSearch}>
              Reset
            </Button>
          </Space>

          <Button type="primary" onClick={showModal} style={{ marginLeft: 620 }}>
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
                <Input
                  value={barangBaru.supplier}
                  onChange={(e) => setBarangBaru({ ...barangBaru, supplier: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Nama Barang" name="namaBarang">
                <Input
                  value={barangBaru.namaBarang}
                  onChange={(e) => setBarangBaru({ ...barangBaru, namaBarang: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Jumlah" name="jumlah">
                <Input
                  type="number"
                  value={barangBaru.jumlah}
                  onChange={(e) =>
                    setBarangBaru({ ...barangBaru, jumlah: parseInt(e.target.value) || 0 })
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

          <Table
            columns={columns}
            dataSource={isSearching ? filteredPembelian : pembelian}
            style={{ margin: "8px" }}
          />
        </TabPane>
      </Tabs>

      <div className="total-biaya-box">
        <strong>Total Biaya: {getTotalBiaya()}</strong>
      </div>

      <Modal
        title="Detail Pembelian"
        visible={isDetailModalVisible}
        onOk={() => setIsDetailModalVisible(false)}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {selectedRecord && (
          <div>
            <p>
              <strong>Supplier:</strong> {selectedRecord.supplier}
            </p>
            <p>
              <strong>Nama Barang:</strong> {selectedRecord.namaBarang}
            </p>
            <p>
              <strong>Jumlah:</strong> {selectedRecord.jumlah}
            </p>
            <p>
              <strong>Total Biaya:</strong> {selectedRecord.biaya}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Pembelian"
        visible={isEditModalVisible}
        onOk={handleSimpanEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Supplier" name="supplier">
            <Input
              value={barangBaru.supplier}
              onChange={(e) => setBarangBaru({ ...barangBaru, supplier: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Nama Barang" name="namaBarang">
            <Input
              value={barangBaru.namaBarang}
              onChange={(e) => setBarangBaru({ ...barangBaru, namaBarang: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Jumlah" name="jumlah">
            <Input
              type="number"
              value={barangBaru.jumlah}
              onChange={(e) =>
                setBarangBaru({ ...barangBaru, jumlah: parseInt(e.target.value) || 0 })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormPembelian;
