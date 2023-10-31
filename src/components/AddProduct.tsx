import React, { useState } from "react";
import { Form, Input, InputNumber, Modal, message } from "antd";
import { ProductsService } from "../services/ProductsService";

interface AddProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {

      const values = await form.validateFields();
      setIsSaving(true);
      

      const newProductData = {
        product_name: values.title,
        product_price: values.price,
        product_quantity: values.stock,
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
            form.resetFields();
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
  }

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
          <Form.Item label="Nama Barang" name="title" rules={[
            {
              required: true,
              message: 'Please input the product name!',
            },
          ]}>
            <Input autoComplete="off" allowClear />
          </Form.Item>
          <Form.Item label="Harga Jual" name="price" rules={[
            {
              required: true,
              message: 'Please input the product price!',
            },
          ]}>
            <InputNumber style={{ width: '100%' }} type="number" />
          </Form.Item>
          <Form.Item label="Stok" name="stock" rules={[
            {
              required: true,
              message: 'Please input the product stock!',
            },
          ]}>
            <InputNumber style={{ width: '100%' }} type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProduct;
