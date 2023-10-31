import React, { useEffect, useState } from "react";
import { Button, Descriptions, DescriptionsProps } from "antd";
import { AdjustmentService } from "../services/AdjustmentService";
import { useParams } from "react-router-dom";
import { ProductsService } from "../services/ProductsService";

interface IProps {
  adjustmentId: number | null;
  onBack: () => void;
}

interface DetailAdjustmentDataType {
  key: React.Key;
  id: number;
  product_id: number;
  product_quantity: number;
  opname_info: string | null;
  createdAt: string;
}

interface DetailProductDataType {
  key: React.Key;
  id: number;
  product_name: string;
}

const DetailAdjustment: React.FC<IProps> = ({ adjustmentId, onBack }) => {
  const [adjustmentData, setAdjustmentData] =
    useState<DetailAdjustmentDataType | null>(null);

  const [productData, setProductData] = useState<DetailProductDataType | null>(
    null
  );

  const { id } = useParams();
  adjustmentId = id ? parseInt(id) : null;

  const productId = adjustmentData?.product_id;

  useEffect(() => {
    if (adjustmentId !== null || productId !== null) {
      if (adjustmentId !== null) {
        AdjustmentService.getAdjustmentById(adjustmentId)
          .then((response) => {
            setAdjustmentData(response.data);
          })
          .catch((error) => {
            console.error("Gagal mengambil data penyesuaian:", error);
          });
      }

      if (productId !== null) {
        ProductsService.getProductById(productId ?? 0)
          .then((response) => {
            setProductData(response.data);
          })
          .catch((error) => {
            console.error("Gagal mengambil data produk:", error);
          });
      }
    }
  }, [adjustmentId, productId]);

  const items: DescriptionsProps["items"] = [
    {
      label: "No. Adjustment",
      span: 1,
      children: <span>ADJUST-{adjustmentData?.id}</span>,
    },
    {
      label: "Tanggal",
      span: 1,
      children: (
        <span>
          {adjustmentData?.createdAt &&
            new Date(adjustmentData.createdAt).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </span>
      ),
    },
    {
      label: "Nama Barang",
      span: 1,
      children: <span>{productData?.product_name}</span>,
    },
    {
      label: "Jumlah",
      span: 1,
      children: <span>{adjustmentData?.product_quantity}</span>,
    },
    {
      label: "Keterangan",
      span: 1,
      children: <span>{adjustmentData?.opname_info}</span>,
    },
  ];

  return (
    <div>
      {adjustmentData && (
        <>
          <Descriptions
            title="Detail Penyesuaian"
            items={items}
            layout="vertical"
          />
          <Button type="primary" onClick={onBack} style={{float:'right'}}>
            Kembali
          </Button>
        </>
      )}
    </div>
  );
};

export default DetailAdjustment;
