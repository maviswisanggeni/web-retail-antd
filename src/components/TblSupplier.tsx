import React, { useEffect, useState } from "react";
import { ISupplier } from "../models/ISupplier";
import { SupplierService } from "../services/SupplierService";
import Table, { ColumnsType } from "antd/es/table";
import { Badge, Button, Modal, Space, Tooltip, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import AddSupplier from "./AddSupplier";
import EditSupplier from "./EditSupplier";

interface IState {
  loading: boolean;
  supplier: ISupplier[];
  errorMsg: string;
  deleteResponse: string | null;
}

interface SupplierDataType {
  key: React.Key;
  id: number;
  supplier_name: string;
  supplier_address: string;
  phone_number: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const TblSupplier: React.FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    supplier: [] as ISupplier[],
    errorMsg: "",
    deleteResponse: null,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const success = (text: string) => {
    messageApi.open({
      type: "success",
      content: text,
      duration: 2,
    });
  };

  const [editSupplierVisible, setEditSupplierVisible] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const handleEditSupplier = (
    supplierId: number,
    updatedSupplier: Partial<ISupplier>
  ): void => {
    const updatedProducts = state.supplier.map((supplier) => {
      return supplier.id === supplierId
        ? { ...supplier, ...updatedSupplier }
        : supplier;
    });

    setState({
      ...state,
      supplier: updatedProducts,
    });
  };

  const [addSupplierVisible, setAddSupplierVisible] = useState(false);
  const handleSaveSupplier = () => {
    SupplierService.getAllSupplier()
      .then((res) => {
        setState({
          ...state,
          loading: false,
          supplier: res.data,
        });

        if (res.data) {
          success("Berhasil menambah supplier");
        } else {
          console.log("Gagal menambah supplier");
        }
      })
      .catch((err) => {
        setState({
          ...state,
          loading: false,
          errorMsg: err.message,
        });
      });
  };

  const dataSupplier: SupplierDataType[] = [];

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    });

    SupplierService.getAllSupplier()
      .then((res) => {
        setState({
          ...state,
          loading: false,
          supplier: res.data,
        });
      })
      .catch((err) => {
        setState({
          ...state,
          loading: false,
          errorMsg: err.message,
        });
      });
  }, []);

  const { loading, supplier, errorMsg } = state;

  for (let i = 0; i < supplier.length; i++) {
    dataSupplier.push({
      key: i + 1,
      id: supplier[i].id,
      supplier_name: supplier[i].supplier_name,
      supplier_address: supplier[i].supplier_address,
      phone_number: supplier[i].phone_number,
      createdAt: supplier[i].createdAt,
      updatedAt: supplier[i].updatedAt,
      status: "Active",
    });
  }

  const { confirm } = Modal;
  const handleDelete = (idSupplier: number) => {
    confirm({
      title: "Are you sure delete this supplier?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        SupplierService.deleteSupplier(idSupplier)
          .then((res) => {
            setState({
              ...state,
              deleteResponse: res.data,
              supplier: state.supplier.filter(
                (supplier) => supplier.id !== idSupplier
              ),
            });
            if (res.data) {
              success("Berhasil menghapus supplier");
            } else {
              console.log("Gagal menghapus supplier");
            }
          })
          .catch((err) => {
            setState({
              ...state,
              errorMsg: err.message,
            });
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columnsSupplier: ColumnsType<SupplierDataType> = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      fixed: "left",
    },
    {
      title: "Kode Supplier",
      dataIndex: "id",
      key: "id",
      render: (text: number) => <span>SUP-{text}</span>,
    },
    {
      title: "Nama Supplier",
      dataIndex: "supplier_name",
      key: "supplier_name",
    },
    {
      title: "Alamat",
      dataIndex: "supplier_address",
      key: "supplier_address",
    },
    {
      title: "No. Telp",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    // },
    // {
    //   title: "Updated At",
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <Badge
          status={text === "Active" ? "success" : "error"}
          text={text}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (record: SupplierDataType) => (
        <>
          <Space>
            {/* <Tooltip title="Detail">
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={() => {}}
              />
            </Tooltip> */}
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedSupplierId(record.id); // Set the selected product ID
                  setEditSupplierVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => {
                  handleDelete(record.id);
                }}
              />
            </Tooltip>
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setAddSupplierVisible(true);
        }}
        style={{ width: 100 }}
      >
        Tambah
      </Button>

      {loading && <p>Loading...</p>}
      {errorMsg && <p>Failed fetch data : {errorMsg}</p>}
      {contextHolder}

      <Table
        columns={columnsSupplier}
        dataSource={dataSupplier}
        scroll={{ x: 1000, y: 400 }}
      />

      <AddSupplier
        visible={addSupplierVisible}
        onClose={() => {
          setAddSupplierVisible(false);
        }}
        onSave={() => {
          handleSaveSupplier();
        }}
      />

      <EditSupplier
        visible={editSupplierVisible}
        onClose={() => setEditSupplierVisible(false)}
        supplierId={selectedSupplierId} // Pass the selected product ID
        onSave={(supplierId, updatedSupplier) =>
          handleEditSupplier(supplierId, updatedSupplier)
        }
      />
    </>
  );
};

export default TblSupplier;
