import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import SearchProduct from "./SearchProduct";
import { AdjustmentService } from "../services/AdjustmentService";

interface AddAdjustmentProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddAdjustment: React.FC<AddAdjustmentProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const newAdjustmentData = {
        product_id: values.product_id,
        product_quantity: values.product_quantity,
        opname_info: values.opname_info,
      };

      AdjustmentService.createAdjustment(newAdjustmentData)
        .then((res) => {
          setIsSaving(false);
          onClose();
          console.log(res.data);
          console.log("Adjustment created successfully!");

          if (onSave) {
            onSave();
            form.resetFields();
          }
        })
        .catch((error) => {
          console.error("Failed to create the adjustment:", error);
          setIsSaving(false);
        });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
    form.setFieldsValue({
      product_id: productId,
    });
  };

  useEffect(() => {
    console.log(`handle product ${selectedProductId}`);
  }, [selectedProductId]);

  return (
    <>
      <Modal
        title="Add Adjustment"
        open={visible}
        onOk={handleSave}
        confirmLoading={isSaving}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="product_name" label="Cari Product">
            <SearchProduct onProductSelect={handleProductSelect} />
          </Form.Item>
          <Form.Item
            name="product_id"
            label="Product ID"
            rules={[
              {
                required: true,
                message: "Please input the product ID!",
              },
            ]}
            hidden
          >
            <InputNumber value={selectedProductId} disabled />
          </Form.Item>
          <Form.Item
            name="product_quantity"
            label="Stok Produk"
            rules={[
              {
                required: true,
                message: "Please input the product quantity!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="opname_info"
            label="Keterangan"
          >
            <Input autoComplete="off" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAdjustment;
