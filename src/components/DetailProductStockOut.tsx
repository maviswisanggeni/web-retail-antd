// DetailProductStockIn.tsx
import React from "react";
import { Modal, Descriptions, DescriptionsProps } from 'antd';

interface DataStockOutType {
  title: string;
  stock: number;
  rating: number;
}

interface DetailProductStockOutProps {
  product: DataStockOutType | null;
  onClose: () => void;
}

const DetailProductStockOut: React.FC<DetailProductStockOutProps> = ({ product, onClose }) => {
  const items: DescriptionsProps['items'] = [
    {
      label: 'Nama Barang',
      span: 1,
      key: 'title',
      children: product?.title?.toString() ?? ''
    },
    {
      label: 'Jumlah Stok',
      span: 1,
      key: 'stock',
      children: product?.stock?.toString() ?? '',
    },
    {
      label: 'Tanggal Keluar',
      span: 2,
      key: 'rating',
      children: new Date(product?.rating.toFixed() ?? 0).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <Modal
      title="Detail Produk Stok Keluar"
      width={720}
      open={product !== null}
      footer={null}
      onCancel={onClose}
    >
      {product && (
        <Descriptions title="" layout="vertical" items={items} />
      )}
    </Modal>
  );
};

export default DetailProductStockOut;
