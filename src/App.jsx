// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import PettyCashForm from './components/PettyCashForm';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/form" />} />
              <Route path="/form" element={<PettyCashForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;