import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { message } from 'antd';
import apiClient from '../api/client';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  
  // Keep track of search term to persist across pagination
  const [searchText, setSearchText] = useState(""); 

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (error) {
      // FIX: Log the actual error to satisfy 'no-unused-vars'
      console.error("Fetch categories error:", error);
    }
  };

  // Fetch Todos with Pagination & Search
  const fetchTodos = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      // Backend expects: ?page=1&limit=10&search=...
      const res = await apiClient.get(`/todos?page=${page}&limit=10&search=${search}`);
      
      setTodos(res.data.data || []); 
      
      setPagination({
        current: res.data.pagination.current_page,
        pageSize: res.data.pagination.per_page,
        total: res.data.pagination.total,
      });
      
      setSearchText(search); 
    } catch (error) {
      // FIX: Log the error
      console.error("Fetch todos error:", error);
      message.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Todo
  const addTodo = async (values) => {
    try {
      await apiClient.post('/todos', values);
      message.success("Todo created!");
      fetchTodos(1, searchText); 
    } catch (error) {
      // FIX: Log the error
      console.error("Create todo error:", error);
      message.error("Failed to create todo");
      throw error;
    }
  };

  // Update Todo
  const updateTodo = async (id, values) => {
    try {
      await apiClient.put(`/todos/${id}`, values);
      message.success("Todo updated!");
      fetchTodos(pagination.current, searchText);
    } catch (error) {
      console.error("Update todo error:", error);
      message.error("Failed to update todo");
      throw error;
    }
  };

  // Toggle Completion
  const toggleComplete = async (id) => {
    try {
      await apiClient.patch(`/todos/${id}/complete`);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      message.success("Status updated");
    } catch (error) {
      // FIX: Log the error
      console.error("Toggle status error:", error);
      message.error("Failed to update status");
      fetchTodos(pagination.current, searchText); 
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await apiClient.delete(`/todos/${id}`);
      message.success("Todo deleted");
      fetchTodos(pagination.current, searchText);
    } catch (error) {
      // FIX: Log the error
      console.error("Delete todo error:", error);
      message.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTodos();
  }, [fetchTodos]);

  return (
    <TodoContext.Provider value={{ 
      todos, categories, loading, pagination, searchText,
      fetchTodos, addTodo, updateTodo, toggleComplete, deleteTodo 
    }}>
      {children}
    </TodoContext.Provider>
  );
};

// FIX: Add this comment to silence the "Fast Refresh" warning for this line
// eslint-disable-next-line react-refresh/only-export-components
export const useTodos = () => useContext(TodoContext);