import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import POS from './pages/POS';
import KDS from './pages/KDS';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="pos" element={<POS />} />
                  <Route path="kds" element={<KDS />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="drivers" element={<Drivers />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </div>
          </NotificationProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;