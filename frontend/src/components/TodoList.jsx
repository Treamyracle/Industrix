import React from 'react';
import { Table, Tag, Button, Tooltip, Popconfirm, Space } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useTodos } from '../context/TodoContext';
import dayjs from 'dayjs';

const TodoList = ({ onEdit }) => {

  const { todos, loading, pagination, fetchTodos, toggleComplete, deleteTodo, searchText, sortParams } = useTodos();



  const getSortOrder = (key) => {
    if (sortParams.field === key) {
      return sortParams.order === 'asc' ? 'ascend' : 'descend';
    }
    return null;
  };

  const columns = [
    {
      title: 'Status',
      key: 'status',
      width: 80,
      align: 'center',
      sorter: true,
      sortOrder: getSortOrder('status'),
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
      sorter: true,
      sortOrder: getSortOrder('title'),
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
      sorter: true,
      sortOrder: getSortOrder('category'),
      responsive: ['sm'],
      render: (cat) => cat ? <Tag color={cat.color || 'blue'}>{cat.name}</Tag> : <Tag>None</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: true,
      sortOrder: getSortOrder('priority'),
      width: 100,
      render: (priority) => {
        const colors = { high: 'red', medium: 'gold', low: 'green' };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      sorter: true,
      sortOrder: getSortOrder('due_date'),
      responsive: ['md'],
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

  const handleTableChange = (newPagination, filters, sorter) => {
    let order = 'desc';
    let field = 'created_at';



    if (sorter.order) {
      order = sorter.order === 'ascend' ? 'asc' : 'desc';
      field = sorter.field || sorter.columnKey;
    }


    if (!sorter.order) {
      field = 'created_at';
      order = 'desc';
    }

    fetchTodos(newPagination.current, searchText, field, order);
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
        showSizeChanger: false,
      }}
      onChange={handleTableChange}
      scroll={{ x: 600 }}
    />
  );
};

export default TodoList;