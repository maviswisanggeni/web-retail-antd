import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import { ProductsEntity } from "../models/IProducts";
import { ProductsService } from "../services/ProductsService";
import type { ColumnsType } from "antd/es/table";
import { Button, Space, Table, Modal, Tooltip, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct";

interface IState {
  loading: boolean;
  products: ProductsEntity[];
  errorMsg: string;
  deleteResponse: string | null;
  searchText: string;
}

interface DataType {
  key: React.Key;
  id: number;
  title: string;
  price: number;
  brand: string;
  stock: number;
  category: string;
}

const { Search } = Input;

const Products: React.FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    products: [] as ProductsEntity[],
    errorMsg: "",
    deleteResponse: null,
    searchText: "",
  });

  const [editProductVisible, setEditProductVisible] = useState(false);
  const [addProductVisible, setAddProductVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const { confirm } = Modal;

  const handleSearch = (selectedKeys: string[], confirm: () => void) => {
    confirm();
    // Set searchText state to the selected keyword
    setState({ ...state, searchText: selectedKeys[0] });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    // Reset searchText state to an empty string
    setState({ ...state, searchText: "" });
  };

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: "Are you sure to delete this product?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK");
        ProductsService.deleteProduct(id)
          .then((res) => {
            setState({
              ...state,
              deleteResponse: JSON.stringify(res.data, null, 2),
            });
          })
          .catch((err) => {
            setState({
              ...state,
              deleteResponse: `Failed to delete product with ID ${id}: ${err.message}`,
            });
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEditProduct = (
    productId: number,
    updatedProductData: Partial<ProductsEntity>
  ): void => {
    const updatedProducts = state.products.map((product) =>
      product.id === productId ? { ...product, ...updatedProductData } : product
    );

    setState({ ...state, products: updatedProducts });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      width: 50,
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "Nama Barang",
      width: 150,
      dataIndex: "title",
      key: "title",
      filters: [
        {
          text: "Cari Nama Barang",
          value: "Cari Nama Barang",
        },
      ],
      onFilter: (_value, record) => {
        return record.title
          .toLowerCase()
          .includes(state.searchText.toLowerCase());
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Cari Nama Barang"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(
                selectedKeys.map((key) => key.toString()),
                confirm
              )
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(
                  selectedKeys.map((key) => key.toString()),
                  confirm
                )
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Cari
            </Button>
            <Button
              onClick={() => handleReset(clearFilters || (() => {}))}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      render: (text) => (
        <div
          style={{
            backgroundColor:
              state.searchText &&
              text.toLowerCase().includes(state.searchText.toLowerCase())
                ? "#5272F239"
                : "transparent",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Harga Jual",
      width: 100,
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `$${price}`,
    },
    {
      title: "Stok",
      width: 50,
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Satuan",
      width: 150,
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Kategori",
      width: 150,
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (record) => (
        <>
          <Space>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedProductId(record.id); // Set the selected product ID
                  setEditProductVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record.id)}
              />
            </Tooltip>
          </Space>
        </>
      ),
    },
  ];

  const data: DataType[] = [];

  // Network request
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
      brand: products[i].brand,
      category: products[i].category,
    });
  }

  return (
    <>
      <div className="content">
        <Title level={2} className="header-title">
          Data Produk
        </Title>
        <Button
          type="primary"
          onClick={() => setAddProductVisible(true)}
          style={{ marginTop: -30, marginBottom: 20, width: 100 }}
        >
          Tambah
        </Button>
        {loading && <p>Loading...</p>}
        {errorMsg && <p>Failed fetch data : {errorMsg}</p>}
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1000, y: 400 }}
        />

        {state.deleteResponse && (
          <Modal
            title="Sukses Menghapus Produk"
            visible={state.deleteResponse !== null} // true
            footer={null}
            onCancel={() => setState({ ...state, deleteResponse: null })}
          >
            <pre>{state.deleteResponse}</pre>
          </Modal>
        )}

        <EditProduct
          visible={editProductVisible}
          onClose={() => setEditProductVisible(false)}
          productId={selectedProductId} // Pass the selected product ID
          onSave={(productId, updatedProduct) =>
            handleEditProduct(productId, updatedProduct)
          }
        />

        <AddProduct
          visible={addProductVisible}
          onClose={() => setAddProductVisible(false)}
          onSave={() => {
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
          }}
        />
      </div>
    </>
  );
};

export default Products;
