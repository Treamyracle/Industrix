import React, { useState } from 'react';
import { Layout, Input, Button, Typography, Card, Row, Col, message } from 'antd';
import { PlusOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { useTodos } from '../context/TodoContext';
import apiClient from '../api/client';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // We destructure fetchCategories here so we can use it later
  const { fetchTodos, fetchCategories } = useTodos();

  const handleSearch = (value) => {
    fetchTodos(1, value);
  };

  const openCreateModal = () => {
    setEditingTodo(null);
    setIsModalVisible(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  // --- Create Category Function ---
  const handleAddCategory = async () => {
    const name = prompt("Enter new category name (e.g., Personal):");
    if (name) {
      try {
        await apiClient.post('/categories', { name, color: 'blue' });
        message.success('Category added!');
        
        // FIX 1: Use fetchCategories() instead of reloading the page
        fetchCategories(); 
        
      } catch (error) {
        // FIX 2: Log the error so the variable is "used"
        console.error("Add category error:", error);
        message.error('Failed to add category');
      }
    }
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
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between" align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input.Search 
                placeholder="Search by title..." 
                onSearch={handleSearch}
                allowClear
                enterButton
              />
            </Col>
            <Col>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Button to add category */}
                <Button icon={<AppstoreAddOutlined />} onClick={handleAddCategory}>
                  Add Category
                </Button>
                
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={openCreateModal}
                >
                  Add Task
                </Button>
              </div>
            </Col>
          </Row>
          
          <TodoList onEdit={openEditModal} />
        </Card>
      </Content>

      <TodoForm 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        initialValues={editingTodo}
      />
    </Layout>
  );
};

export default Dashboard;