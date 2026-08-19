import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductAnalytics from './pages/ProductAnalytics';
import CustomerAnalytics from './pages/CustomerAnalytics';
import SalesTeamAnalytics from './pages/SalesTeamAnalytics';
import Reports from './pages/Reports';
import ImportSales from './pages/ImportSales';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Root route handler: visitors get Landing, logged-in users get Dashboard
const RootHandler = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Root Route */}
          <Route path="/" element={<RootHandler />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Workspace Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductAnalytics />} />
            <Route path="customers" element={<CustomerAnalytics />} />
            <Route path="sales-team" element={<SalesTeamAnalytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="import" element={<ImportSales />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}