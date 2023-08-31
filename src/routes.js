import { Routes, Route, Navigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';

// import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Profile from './pages/Profile';
import DashboardAppPage from './pages/DashboardAppPage';
import Data from './pages/Data'

// ----------------------------------------------------------------------
import { ProtectedRoute } from './ProtectedRoute';

export default function Router() { 
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} >
        <Route index element={<Navigate to="/dashboard/app" />} /> 
      </Route>
     
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard/app" element={<ProtectedRoute element={<DashboardAppPage />} />} />
        <Route path="dashboard/user" element={<ProtectedRoute element={<UserPage />} />} />
        <Route path="dashboard/profile/:emailAddress" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="dashboard/data" element={<ProtectedRoute element={<Data />} />} />
      </Route>
      <Route path="/404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}
