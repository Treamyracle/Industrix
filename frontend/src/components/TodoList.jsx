import React from 'react';
import { Table, Tag, Button, Tooltip, Popconfirm, Space } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTodos } from '../context/TodoContext';
import dayjs from 'dayjs';

const TodoList = ({ onEdit }) => {
  const { todos, loading, pagination, fetchTodos, toggleComplete, deleteTodo, searchText } = useTodos();

  // Columns configuration for Ant Design Table
  const columns = [
    {
      title: 'Status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Toggle Completion">
          <Button 
            type="text"
            icon={record.completed ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} /> : <CloseCircleOutlined style={{ color: '#d9d9d9', fontSize: '20px' }} />} 
            onClick={() => toggleComplete(record.id)}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ opacity: record.completed ? 0.5 : 1 }}>
          <div style={{ fontWeight: 'bold', textDecoration: record.completed ? 'line-through' : 'none' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['sm'], // Hide on mobile
      render: (cat) => cat ? <Tag color={cat.color || 'blue'}>{cat.name}</Tag> : <Tag>None</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        // Colors based on Priority Levels [cite: 67]
        const colors = { high: 'red', medium: 'gold', low: 'green' };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      responsive: ['md'], // Hide on smaller screens
      render: (date) => date ? dayjs(date).format('MMM D, YYYY') : '-'
    },
    {
      title: 'Actions',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Delete?" onConfirm={() => deleteTodo(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle Page Change
  const handleTableChange = (newPagination) => {
    fetchTodos(newPagination.current, searchText);
  };

  return (
    <Table
      dataSource={todos}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: false, // Keep it simple per requirements
      }}
      onChange={handleTableChange}
      scroll={{ x: 600 }} // Horizontal scroll for mobile
    />
  );
};

export default TodoList;