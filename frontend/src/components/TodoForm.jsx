import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useTodos } from '../context/TodoContext';
import dayjs from 'dayjs';

const { Option } = Select;

const TodoForm = ({ visible, onClose, initialValues }) => {
  const [form] = Form.useForm();
  const { addTodo, updateTodo, categories } = useTodos();

  // Reset or Set form values when modal opens/closes
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // If editing, pre-fill data [cite: 15]
        form.setFieldsValue({
          ...initialValues,
          // Convert ISO string to dayjs object for DatePicker
          due_date: initialValues.due_date ? dayjs(initialValues.due_date) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format payload to match Backend Struct
      const payload = {
        ...values,
        // AntD DatePicker returns a dayjs object, convert to ISO string
        due_date: values.due_date ? values.due_date.toISOString() : null,
      };

      if (initialValues) {
        await updateTodo(initialValues.id, payload);
      } else {
        await addTodo(payload);
      }
      
      onClose();
      form.resetFields();
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Task" : "Create New Task"}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={initialValues ? "Update" : "Create"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="e.g. Finish Coding Challenge" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Form.Item name="priority" label="Priority" style={{ flex: 1 }} rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              {/* Priority Levels [cite: 66] */}
              <Option value="high">High (Red)</Option>
              <Option value="medium">Medium (Yellow)</Option>
              <Option value="low">Low (Green)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category_id" label="Category" style={{ flex: 1 }}>
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;