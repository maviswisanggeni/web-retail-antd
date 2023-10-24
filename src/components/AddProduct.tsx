import React, { useState } from "react";
import { Form, Input, InputNumber, Select, Modal, message } from "antd";
import { ProductsService } from "../services/ProductsService";

interface AddProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectChange = (value: { value: string; label: React.ReactNode }) => {
    console.log(`selected ${value}`);
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const newProductData = {
        title: values.title,
        price: values.price,
        stock: values.stock,
        brand: values.brand,
        category: values.category,
      };

      ProductsService.createProduct(newProductData)
        .then((res) => {
          setIsSaving(false);
          onClose();
          message.success("Product created successfully!");
          console.log(res.data);
          console.log("Product created successfully!");

          if (onSave) {
            onSave();
          }
        })
        .catch((error) => {
          message.error("Failed to create the product!");
          console.error("Failed to create the product:", error);
          setIsSaving(false);
        });
    } catch (errorInfo) {
      message.error("Failed to create the product!");
      console.log("Failed:", errorInfo);
    }
  };

  return (
    <>
      <Modal
        title="Add Product"
        open={visible}
        onOk={handleSave}
        confirmLoading={isSaving}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical" name="add_product_form" initialValues={{ category: 'smartphone' }}>
          <Form.Item label="Nama Barang" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Harga Jual" name="price">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Stok" name="stock">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Satuan" name="brand">
            <Input />
          </Form.Item>
          <Form.Item label="Kategori" name="category">
            <Select 
              onChange={handleSelectChange}
              options={[
                {
                  value: 'laptop',
                  label: 'Laptop',
                },
                {
                  value: 'electronics',
                  label: 'Electronics',
                },
                {
                  value: 'atk',
                  label: 'ATK',
                },
                {
                  value: 'lainnya',
                  label: 'Lainnya',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProduct;
