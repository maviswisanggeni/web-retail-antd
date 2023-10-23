import { Button, Space, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { ProductsEntity } from "../models/IProducts";
import Table, { ColumnsType } from "antd/es/table";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { ProductsService } from "../services/ProductsService";
import FormAddStockOut from "./FormAddStockOut";

interface IState {
  loading: boolean;
  products: ProductsEntity[];
  errorMsg: string;
  deleteResponse: string | null;
  searchText: string;
  isFormAddStockOutVisible: boolean;
}

interface DataStockOutType {
  key: React.Key;
  id: number;
  title: string;
  stock: number;
  rating: number;
}

const TblStockOut: React.FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    products: [] as ProductsEntity[],
    errorMsg: "",
    deleteResponse: null,
    searchText: "",
    isFormAddStockOutVisible: false,
  });

  const column: ColumnsType<DataStockOutType> = [
    {
      title: "No",
      width: 50,
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "Nama Barang",
      width: 100,
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Jumlah Stok",
      width: 50,
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Tanggal Keluar",
      width: 100,
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => {
        return (
          <>
            {/* date */}
            {new Date(rating.toFixed()).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 50,
      render: () => (
        <Space>
            <Tooltip title="Detail">
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                onClick={() => {
                  // setSelectedProductId(record.id); // Set the selected product ID
                  // setEditProductVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => {
                  // showDeleteConfirm(record.id)
                }}
              />
            </Tooltip>
          </Space>
      ),
    },
  ];

  const data: DataStockOutType[] = [];

  useEffect(() => {
    setState({ ...state, loading: true });
    ProductsService.getAllProducts()
      .then((res) =>
        setState({
          ...state,
          loading: false,
          products: res.data.products,
        })
      )
      .catch((err) => {
        setState({
          ...state,
          loading: false,
          errorMsg: err.message,
        });
      });
  }, []);

  const { loading, products, errorMsg } = state;

  for (let i = 0; i < products.length; i++) {
    data.push({
      key: i,
      id: products[i].id,
      title: products[i].title,
      stock: products[i].stock,
      rating: products[i].rating,
    });
  }

  return (
    <>
      <div>
        {state.isFormAddStockOutVisible && <FormAddStockOut />}
        <Title level={2}>Tabel Stok Keluar</Title>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() => {
            setState({
              ...state,
              isFormAddStockOutVisible: true,
            });
          }}
        >
          Tambah
        </Button>
        {state.isFormAddStockOutVisible &&  <Button
          type="default"
          onClick={() => {
            setState({
              ...state,
              isFormAddStockOutVisible: false,
            });
          }}
          style={{ 
            position: "absolute",
            top: 0,
            right: 20,
          }}
        >
          Close Form
        </Button>}
        {loading && <p>Loading...</p>}
        {errorMsg && <p>Failed fetch data : {errorMsg}</p>}
        <Table
          columns={column}
          dataSource={data}
          scroll={{ x: 1000, y: 400 }}
          style={{ marginTop: 20 }}
        />
      </div>
    </>
  );
};

export default TblStockOut;
