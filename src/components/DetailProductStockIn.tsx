// DetailProductStockIn.tsx
import React from "react";
import { Modal, Descriptions, DescriptionsProps } from 'antd';

interface DataStockInType {
  title: string;
  stock: number;
  rating: number;
  suplier: string;
}

interface DetailProductStockInProps {
  product: DataStockInType | null;
  onClose: () => void;
}

const DetailProductStockIn: React.FC<DetailProductStockInProps> = ({ product, onClose }) => {
  const items: DescriptionsProps['items'] = [
    {
      label: 'Nama Barang',
      span: 3,
      key: 'title',
      children: product?.title?.toString() ?? ''
    },
    {
      label: 'Jumlah Stok',
      span: 3,
      key: 'stock',
      children: product?.stock?.toString() ?? '',
    },
    {
      label: 'Tanggal Masuk',
      span: 3,
      key: 'rating',
      children: new Date(product?.rating.toFixed() ?? 0).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      label: 'Pemasok Produk',
      span: 3,
      key: 'suplier',
      children: [
        product?.suplier?.toString() ?? 'Pemasok 1',        
      ],
    }
  ];

  return (
    <Modal
      title="Detail Produk Stok Masuk"
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

export default DetailProductStockIn;