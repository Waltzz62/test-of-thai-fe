import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ClassesPage } from './pages/ClassesPage.tsx';
import { ClassDetailPage } from './pages/ClassDetailPage.tsx';
import { MyBookingsPage } from './pages/MybookingsPage';
import { StaffApplicationPage } from './pages/StaffApplicationPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminClassesPage } from './pages/admin/AdminClassesPage.tsx';
import { AdminSchedulesPage } from './pages/admin/AdminSchedulesPage.tsx';
import { AdminStaffPage } from './pages/admin/AdminStaffPage.tsx';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage.tsx';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage.tsx';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard.tsx';
import { StaffSchedulesPage } from './pages/staff/StaffSchedulesPage.tsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/apply-staff" element={<StaffApplicationPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'DEV']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/classes" element={<AdminClassesPage />} />
          <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
          <Route path="/admin/staff" element={<AdminStaffPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/schedules" element={<StaffSchedulesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;