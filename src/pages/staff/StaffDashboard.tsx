import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function StaffDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/staff/schedules"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Calendar className="h-10 w-10 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">My Schedules</h3>
          <p className="text-gray-600">View and manage your teaching schedules</p>
        </Link>
      </div>
    </div>
  );
}