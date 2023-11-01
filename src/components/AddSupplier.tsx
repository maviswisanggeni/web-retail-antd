import { Form, Input, InputNumber, Modal } from "antd";
import React, { useState } from "react";
import { SupplierService } from "../services/SupplierService";
import TextArea from "antd/es/input/TextArea";

interface AddSupplierProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const newSupplierData = {
        supplier_name: values.supplier_name,
        supplier_address: values.supplier_address,
        phone_number: values.phone_number,
      };

      SupplierService.createSupplier(newSupplierData)
        .then((res) => {
          setIsSaving(false);
          onClose();
          console.log(res.data);
          console.log("Supplier created successfully!");

          if (onSave) {
            onSave();
            form.resetFields();
          }
        })
        .catch((error) => {
          console.error("Failed to create the supplier:", error);
          setIsSaving(false);
        })
    } catch (err) {
      console.log("Failed:", err);
    }
  }

  return (
    <>
      <Modal 
        title="Add Supplier"
        open={visible}
        onOk={handleSave}
        confirmLoading={isSaving}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="supplier_name"
            label="Nama Supplier"
            rules={[
              {
                required: true,
                message: "Please input supplier name!",
              },
            ]}
          >
            <Input placeholder="Nama Supplier" />
          </Form.Item>
          <Form.Item
            name="supplier_address"
            label="Alamat"
          >
            <TextArea placeholder="Alamat" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="No. Telp"
          >
            <Input placeholder="08xxxxxxxxxx" type="number"/>
          </Form.Item>
        </Form>
      </Modal>        
    </>
  )
}

export default AddSupplier;