import { Button, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IAdjustment } from "../models/IAdjustment";
import Table, { ColumnsType } from "antd/es/table";
import { AdjustmentService } from "../services/AdjustmentService";
import { InfoCircleOutlined } from "@ant-design/icons";
import DetailAdjustment from "./DetailAdjustment";
import AddAdjustment from "./AddAdjustment";

interface IState {
  loading: boolean;
  adjustment: IAdjustment[];
  errorMsg: string;
}

interface AdjusmentDataType {
  key: React.Key;
  id: number;
  product_id: number;
  stock: number;
  opname_info: string | null;
  created_at: string;
}

const Adjustment: React.FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    adjustment: [] as IAdjustment[],
    errorMsg: "",
  });

  const [addAdjustmentVisible, setAddAdjustmentVisible] = useState(false);
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<
    number | null
  >(null);

  const columns: ColumnsType<AdjusmentDataType> = [
    {
      title: "No. Adjustment",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span>ADJUST-{text}</span>,
    },
    {
      title: "Tanggal",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => {
        const date = new Date(text);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("id-ID", { month: "long" });
        const day = date.getDate();

        return (
          <span>
            {day} {month} {year}
          </span>
        );
      },
    },
    // {
    //   title: "Nama Barang",
    //   dataIndex: "product_id",
    //   key: "product_id",
    // },
    // {
    //   title: "Stok",
    //   dataIndex: "stock",
    //   key: "stock",
    // },
    {
      title: "Keterangan",
      dataIndex: "opname_info",
      key: "opname_info",
    },
    {
      title: "Action",
      fixed: "right",
      render: (record) => (
        <Tooltip title="Detail">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              setSelectedAdjustmentId(record.id); // Set the selected product ID
              <DetailAdjustment
                adjustmentId={selectedAdjustmentId}
                onBack={() => {
                  setSelectedAdjustmentId(null);
                }}
              />;
              window.location.href = "/gudang/stok/" + record.id;
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const data: AdjusmentDataType[] = [];

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    });

    AdjustmentService.getAllAdjustment()
      .then((res) =>
        setState({
          ...state,
          loading: false,
          adjustment: res.data,
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

  const { loading, adjustment, errorMsg } = state;

  for (let i = 0; i < adjustment.length; i++) {
    data.push({
      key: i + 1,
      id: adjustment[i].id,
      product_id: adjustment[i].product_id,
      stock: adjustment[i].product_quantity,
      opname_info: adjustment[i].opname_info,
      created_at: adjustment[i].createdAt,
    });
  }

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setAddAdjustmentVisible(true);
        }}
        style={{
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        Buat Penyesuaian
      </Button>
      {loading && <p>Loading...</p>}
      {errorMsg && <p>Failed fetch data : {errorMsg}</p>}

      <Table columns={columns} dataSource={data} scroll={{ x: 1000, y: 400 }} />

      <AddAdjustment 
        visible={addAdjustmentVisible}
        onClose={() => {
          setAddAdjustmentVisible(false);
        }}
        onSave={() => {
          AdjustmentService.getAllAdjustment()
            .then((res) =>
              setState({
                ...state,
                loading: false,
                adjustment: res.data,
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
    </>
  );
};

export default Adjustment;
