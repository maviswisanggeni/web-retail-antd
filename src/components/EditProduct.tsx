import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Modal, message } from "antd";
import { ProductsService } from "../services/ProductsService"; // Import your ProductsService
import { ProductsEntity } from "../models/IProducts";

interface EditProductProps {
  visible: boolean;
  onClose: () => void;
  productId: number | null; // Changed the type to number | null
  onSave: (productId: number, updatedProduct: Partial<ProductsEntity>) => void;
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

      // Prepare the data to be sent in the PUT request
      const updatedProductData = {
        title: values.title,
        price: values.price,
        stock: values.stock,
        brand: values.brand,
        category: values.category,
      };

      // Make a PUT request to update the product
      if (productId !== null) {
        ProductsService.updateProduct(productId, updatedProductData)
          .then(() => {
            // After a successful update, trigger a callback and close the modal
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

  // When the EditProduct component is mounted or the productId changes, fetch the product data
  useEffect(() => {
    if (visible && productId !== null) {
      // Fetch the product data based on the productId
      ProductsService.getProduct(productId)
        .then((res) => {
          form.setFieldsValue(res.data); // Set the form fields with product data
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
          <Form.Item label="Product Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Stock" name="stock">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Brand" name="brand">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>{/* Add options for categories */}</Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditProduct;
