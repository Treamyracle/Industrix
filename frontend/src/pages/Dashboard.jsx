import React, { useState } from 'react';
import { Layout, Input, Button, Typography, Card, Row, Col, Select } from 'antd';
import { PlusOutlined, AppstoreAddOutlined, FilterOutlined } from '@ant-design/icons';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import CategoryForm from '../components/CategoryForm';
import { useTodos } from '../context/TodoContext';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const [filters, setFilters] = useState({
    priority: null,
    status: null,
    category_id: null
  });

  const { fetchTodos, categories, searchText, sortParams } = useTodos();

  const handleSearch = (value) => {
    fetchTodos(1, value, sortParams.field, sortParams.order, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    fetchTodos(1, searchText, sortParams.field, sortParams.order, newFilters);
  };

  const openCreateModal = () => {
    setEditingTodo(null);
    setIsModalVisible(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  const openCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Industrix Todos</Title>
        </div>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Card>
          {/* ROW 1: Search & Main Buttons */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} justify="space-between" align="middle">
            <Col xs={24} sm={10}>
              <Input.Search
                placeholder="Search by title..."
                onSearch={handleSearch}
                allowClear
                enterButton
              />
            </Col>
            <Col>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button icon={<AppstoreAddOutlined />} onClick={openCategoryModal}>
                  Add Category
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                  Add Task
                </Button>
              </div>
            </Col>
          </Row>

          {/* ROW 2: Filters (Advanced Filtering) */}
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <span style={{ marginRight: 8, fontWeight: 500 }}><FilterOutlined /> Filters:</span>
              </Col>

              {/* Filter by Category */}
              <Col xs={24} sm={6}>
                <Select
                  placeholder="All Categories"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(val) => handleFilterChange('category_id', val)}
                >
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                  ))}
                </Select>
              </Col>

              {/* Filter by Priority */}
              <Col xs={24} sm={6}>
                <Select
                  placeholder="All Priorities"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(val) => handleFilterChange('priority', val)}
                >
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </Col>

              {/* Filter by Status */}
              <Col xs={24} sm={6}>
                <Select
                  placeholder="All Status"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(val) => handleFilterChange('completed', val)}
                >
                  <Option value="true">Completed</Option>
                  <Option value="false">Pending</Option>
                </Select>
              </Col>
            </Row>
          </div>

          <TodoList onEdit={openEditModal} />
        </Card>
      </Content>

      <TodoForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        initialValues={editingTodo}
      />

      <CategoryForm
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
      />
    </Layout>
  );
};

export default Dashboard;