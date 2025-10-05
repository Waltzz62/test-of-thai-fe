import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, FileText, ClipboardList } from 'lucide-react';

export function AdminDashboard() {
  const menuItems = [
    { title: 'Classes', icon: BookOpen, path: '/admin/classes', description: 'Manage cooking classes' },
    { title: 'Schedules', icon: Calendar, path: '/admin/schedules', description: 'Manage class schedules' },
    { title: 'Staff', icon: Users, path: '/admin/staff', description: 'Manage instructors' },
    { title: 'Applications', icon: FileText, path: '/admin/applications', description: 'Review staff applications' },
    { title: 'Bookings', icon: ClipboardList, path: '/admin/bookings', description: 'Manage bookings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <Icon className="h-10 w-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}