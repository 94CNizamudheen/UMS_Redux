import React from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../Features/Auth/authSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Show loading state if user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">
                  {user?.role === 'admin' ? 'Admin Portal' : 'User Portal'}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/profile" className="flex items-center">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username[0]}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold mr-2">
                    {user.username[0].toUpperCase()}
                  </div>
                )}

                <span className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {user?.username}!
          </h1>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Account Details</h2>
            <div className="flex flex-col items-center md:items-start mb-4">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-3xl border-2 border-gray-200 mb-4">
                  {user.username[0].toUpperCase()}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Account Created:</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {user?.role === 'admin' ? (
              <Link
                to="/admin/Dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;