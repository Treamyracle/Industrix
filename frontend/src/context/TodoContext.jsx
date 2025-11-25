import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { message } from 'antd';
import apiClient from '../api/client';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [sortParams, setSortParams] = useState({ field: 'created_at', order: 'desc' });

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const addCategory = async (values) => {
    try {
      await apiClient.post('/categories', values);
      message.success("Category created!");
      fetchCategories();
    } catch (error) {
      console.error("Create category error:", error);
      message.error("Failed to create category");
      throw error;
    }
  };

  const fetchTodos = useCallback(async (
    page = 1,
    search = searchText,
    sortField = sortParams.field,
    sortOrder = sortParams.order,
    currentFilters = filters
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (search) params.append('search', search);
      params.append('sort_by', sortField);
      params.append('order', sortOrder);

      if (currentFilters.priority) params.append('priority', currentFilters.priority);
      if (currentFilters.completed) params.append('completed', currentFilters.completed);
      if (currentFilters.category_id) params.append('category_id', currentFilters.category_id);

      const res = await apiClient.get(`/todos?${params.toString()}`);

      setTodos(res.data.data || []);
      setPagination({
        current: res.data.pagination.current_page,
        pageSize: res.data.pagination.per_page,
        total: res.data.pagination.total,
      });

      setSearchText(search);
      setSortParams({ field: sortField, order: sortOrder });
      setFilters(currentFilters);

    } catch (error) {
      console.error("Fetch todos error:", error);
      message.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [searchText, sortParams, filters]);

  const addTodo = async (values) => {
    try {
      await apiClient.post('/todos', values);
      message.success("Todo created!");
      fetchTodos(1, searchText, sortParams.field, sortParams.order);
    } catch (error) {
      console.error("Create todo error:", error);
      message.error("Failed to create todo");
      throw error;
    }
  };

  const updateTodo = async (id, values) => {
    try {
      await apiClient.put(`/todos/${id}`, values);
      message.success("Todo updated!");
      fetchTodos(pagination.current, searchText, sortParams.field, sortParams.order);
    } catch (error) {
      console.error("Update todo error:", error);
      message.error("Failed to update todo");
      throw error;
    }
  };

  const toggleComplete = async (id) => {
    try {
      await apiClient.patch(`/todos/${id}/complete`);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      message.success("Status updated");
    } catch (error) {
      console.error("Toggle status error:", error);
      message.error("Failed to update status");
      fetchTodos(pagination.current, searchText, sortParams.field, sortParams.order);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await apiClient.delete(`/todos/${id}`);
      message.success("Todo deleted");
      fetchTodos(pagination.current, searchText, sortParams.field, sortParams.order);
    } catch (error) {
      console.error("Delete todo error:", error);
      message.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTodos(1, "", "created_at", "desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TodoContext.Provider value={{
      todos, categories, loading, pagination, searchText, sortParams,
      fetchTodos, addTodo, updateTodo, toggleComplete, deleteTodo, addCategory
    }}>
      {children}
    </TodoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodos = () => useContext(TodoContext);