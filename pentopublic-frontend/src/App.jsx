import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BookListingPage from './pages/book/BookListingPage';
import BookDetailPage from './pages/book/BookDetailPage';

// Placeholder components for routes that will be implemented
const BookReadPage = () => <div className="p-8">Book Reader - Coming Soon</div>;
const ReaderDashboard = () => <div className="p-8">Reader Dashboard - Coming Soon</div>;
const AuthorDashboard = () => <div className="p-8">Author Dashboard - Coming Soon</div>;
const AdminDashboard = () => <div className="p-8">Admin Dashboard - Coming Soon</div>;
const SubscriptionPage = () => <div className="p-8">Subscription Page - Coming Soon</div>;
const ProfilePage = () => <div className="p-8">Profile Page - Coming Soon</div>;
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized</h1>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main app routes (with layout) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BookListingPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/books/:id/read" element={
                  <ProtectedRoute>
                    <BookReadPage />
                  </ProtectedRoute>
                } />
                
                {/* Reader-only routes */}
                <Route path="/reader/dashboard" element={
                  <ProtectedRoute requiredRole="Reader">
                    <ReaderDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/subscription" element={
                  <ProtectedRoute requiredRole="Reader">
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                
                {/* Author-only routes */}
                <Route path="/author/dashboard" element={
                  <ProtectedRoute requiredRole="Author">
                    <AuthorDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/author/upload" element={
                  <ProtectedRoute requiredRole="Author">
                    <div className="p-8">Book Upload Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                
                {/* Admin-only routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600">Page not found.</p>
                    </div>
                  </div>
                } />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
