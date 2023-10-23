// DetailProductStockIn.tsx
import React from "react";
import { Modal, Descriptions, DescriptionsProps } from 'antd';

interface DataStockInType {
  title: string;
  stock: number;
  rating: number;
}

interface DetailProductStockInProps {
  product: DataStockInType | null;
  onClose: () => void;
}

const DetailProductStockIn: React.FC<DetailProductStockInProps> = ({ product, onClose }) => {
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
      label: 'Tanggal Masuk',
      span: 2,
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
      span: 2,
      key: 'suplier',
      children: [
        'Pemasok 1',
        'Pemasok 2',
        'Pemasok 3',
      ][Math.floor(Math.random() * 3)        
      ],
    }
  ];

  return (
    <Modal
      title="Detail Produk Stok Masuk"
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

export default DetailProductStockIn;
