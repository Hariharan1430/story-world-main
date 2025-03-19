import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserRoles from './pages/UserRoles';
import Stories from './pages/Stories';
import ProtectedRoute from './components/ProtectedRoute';
import CreateStory from './pages/CreateStory';
import StoryPreview from './pages/StoryPreview';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="userroles" element={<UserRoles />} />
            <Route path="stories" element={<Stories />} />
            <Route path="create-story" element={<CreateStory />} />
            <Route path="/story-preview/:id" element={<StoryPreview />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;