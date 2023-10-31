import React, { useEffect, useState } from "react";
import { ProductsService } from "../services/ProductsService";
import { Select } from "antd";

interface SearchProductProps {
  onProductSelect: (productId: number) => void;
}

const SearchProduct: React.FC<SearchProductProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await ProductsService.getAllProducts();
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProducts();
  }, []);

  const onChange = (value: string) => {
    const productId = parseInt(value, 10);
    onProductSelect(productId);
  };

  return (
    <Select
      showSearch
      placeholder="Cari produk"
      optionFilterProp="children"
      onChange={onChange}
      loading={loading}
      options={products.map((product: any) => ({
        label: product.product_name,
        value: product.id.toString(),
      }))}
    />
  );
};

export default SearchProduct;
