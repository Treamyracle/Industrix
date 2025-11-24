import React from 'react';
import { TodoProvider } from './context/TodoContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // Wrap app in Context Provider 
    <TodoProvider>
      <Dashboard />
    </TodoProvider>
  );
}

export default App;