import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import { ProductsEntity } from "../models/IProducts";
import { ProductsService } from "../services/ProductsService";
import type { ColumnsType } from "antd/es/table";
import { Button, Space, Table } from 'antd';

interface IState {
  loading: boolean;
  products: ProductsEntity[];
  errorMsg: string;
}

interface DataType {
  key: React.Key;
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
}

const Products: React.FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    products: [] as ProductsEntity[],
    errorMsg: "",
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Product Id",
      width: 50,
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "Title",
      width: 150,
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      width: 50,
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      width: 50,
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
      width: 150,
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: () => (
        <>
          <Space>
            <Button type="primary">Edit</Button>
            <Button type="default">Detail</Button>
            <Button danger>Delete</Button>
          </Space>
        </>
      ),
    },
  ];

  const data: DataType[] = [];

  // network request
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
      .catch((err) =>
        setState({
          ...state,
          loading: false,
          errorMsg: err.message,
        })
      );
  }, []);

  const { loading, products, errorMsg } = state;

  for (let i = 0; i < products.length; i++) {
    data.push({
      key: i,
      id: products[i].id,
      title: products[i].title,
      price: products[i].price,
      stock: products[i].stock,
      category: products[i].category,
    });
  }

  return (
    <>
      <div className="content">
        <Title>Data Products From APIs</Title>
        {loading && <p>Loading...</p>}
        {errorMsg && <p>Failed fetch data : {errorMsg}</p>}
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1000, y: 300 }}
        />
      </div>
    </>
  );
};

export default Products;
