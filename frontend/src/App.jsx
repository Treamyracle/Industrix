import React from 'react';
import { TodoProvider } from './context/TodoContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <TodoProvider>
      <Dashboard />
    </TodoProvider>
  );
}

export default App;