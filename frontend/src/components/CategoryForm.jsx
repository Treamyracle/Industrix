import React from 'react';
import { Modal, Form, Input, ColorPicker } from 'antd';
import { useTodos } from '../context/TodoContext';

const CategoryForm = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { addCategory } = useTodos();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let colorHex = '#1677ff';

      if (values.color) {
        colorHex = typeof values.color === 'string' ? values.color : values.color.toHexString();
      }

      const payload = {
        name: values.name,
        color: colorHex
      };

      await addCategory(payload);

      onClose();
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title="Create New Category"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Create"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          color: '#1677ff'
        }}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input placeholder="e.g. Work, Personal, Shopping" />
        </Form.Item>

        <Form.Item
          name="color"
          label="Label Color"
          getValueFromEvent={(color) => {
            return color;
          }}
        >
          <ColorPicker showText />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;