import React, { useEffect, useState } from "react";
import { ISupplier } from "../models/ISupplier";
import { Form, Input, Modal, message } from "antd";
import { SupplierService } from "../services/SupplierService";
import TextArea from "antd/es/input/TextArea";

interface EditSupplierProps {
  visible: boolean;
  onClose: () => void;
  onSave: (supplierId: number, updatedSupplier: Partial<ISupplier>) => void;
  supplierId: number | null;
}

const EditSupplier: React.FC<EditSupplierProps> = ({
  visible,
  onClose,
  onSave,
  supplierId,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const updatedSupplierData = {
        supplier_name: values.supplier_name,
        supplier_address: values.supplier_address,
        phone_number: values.phone_number,
      };

      if (supplierId !== null) {
        SupplierService.updateSupplier(supplierId, updatedSupplierData)
          .then(() => {
            onSave(supplierId, updatedSupplierData);
            setIsSaving(false);
            onClose();
            message.success("Supplier updated successfully!");
            console.log("Supplier updated successfully!");
          })
          .catch((error) => {
            message.error("Failed to update the supplier!");
            console.error("Failed to update the supplier:", error);
            setIsSaving(false);
          });
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  useEffect(() => {
    if (visible && supplierId !== null) {
      SupplierService.getSupplierById(supplierId)
        .then((res) => {
          form.setFieldsValue({
            supplier_name: res.data.supplier_name,
            supplier_address: res.data.supplier_address,
            phone_number: res.data.phone_number,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [visible, supplierId]);

  return (
    <>
      <Modal
        title="Edit Supplier"
        open={visible}
        onOk={handleSave}
        onCancel={onClose}
        confirmLoading={isSaving}
        okText="Save"
        cancelText="Cancel"
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
  );
};

export default EditSupplier;