import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut} from 'lucide-react';
import { auth } from '../lib/auth';

export function Layout() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const isAuthenticated = auth.isAuthenticated();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <span className="font-bold text-xl">Taste of Thai</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link to="/classes" className="text-gray-700 hover:text-orange-600 px-3 py-2">
                  Classes
                </Link>
                {isAuthenticated && (
                  <Link to="/my-bookings" className="text-gray-700 hover:text-orange-600 px-3 py-2">
                    My Bookings
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">
                    {user?.name} ({user?.role})
                  </span>
                  
                  {user?.role === 'ADMIN' || user?.role === 'DEV' ? (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Admin
                    </Link>
                  ) : user?.role === 'STAFF' ? (
                    <Link
                      to="/staff"
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Staff
                    </Link>
                  ) : null}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}