import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Modal, message } from "antd";
import { ProductsService } from "../services/ProductsService"; // Import your ProductsService
import { IProducts } from "../models/IProducts";

interface EditProductProps {
  visible: boolean;
  onClose: () => void;
  productId: number | null;
  onSave: (productId: number, updatedProduct: Partial<IProducts>) => void;
}

const EditProduct: React.FC<EditProductProps> = ({
  visible,
  onClose,
  productId,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const updatedProductData = {
        product_name: values.title,
        product_price: values.price,
        product_quantity: values.stock,
      };

      if (productId !== null) {
        ProductsService.updateProduct(productId, updatedProductData)
          .then(() => {
            onSave(productId, updatedProductData);
            setIsSaving(false);
            onClose();
            message.success("Product updated successfully!");
            console.log("Product updated successfully!");
          })
          .catch((error) => {
            message.error("Failed to update the product!");
            console.error("Failed to update the product:", error);
            setIsSaving(false);
          });
      }
    } catch (errorInfo) {
      message.error("Failed to update the product!");
      console.log("Failed:", errorInfo);
    }
  };

  useEffect(() => {
    if (visible && productId !== null) {
      ProductsService.getProductById(productId)
        .then((res) => {
          
          form.setFieldsValue({
            title: res.data.product_name,
            price: `Rp. ${res.data.product_price.toLocaleString("id-ID")}`,
            stock: res.data.product_quantity,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch product data:", err);
        });
    }
  }, [visible, productId]);

  return (
    <>
      <Modal
        title="Edit Product"
        open={visible}
        onOk={handleSave}
        confirmLoading={isSaving}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical" name="edit_product_form">
          <Form.Item label="Nama Barang" name="title">
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Harga" name="price">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Stok" name="stock">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditProduct;
