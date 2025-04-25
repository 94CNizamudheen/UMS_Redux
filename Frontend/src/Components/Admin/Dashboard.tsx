

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks'
import { useNavigate } from 'react-router-dom';
import { User } from '../../Types';
import { logout } from '../../Features/Auth/authSlice';
import { deleteUser, fetchUsers } from '../../Features/Users/userSlice';

import UserModal from './UserModal';


const Dashboard: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {users, isLoading, error } = useAppSelector((state) => state.users);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

 
    useEffect(() => {
      dispatch(fetchUsers());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const filteredUsers = Array.isArray(users)
    ? users.filter((user: User) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      })
    : [];

    const handleAddUser = () => {
        setCurrentUser(null); 
        setIsEditing(false);
        setShowModal(true);
    }
    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user')) {
            dispatch(deleteUser({ userId }))
        }
    };
    const handleEditUser = (user:User) => {
        setCurrentUser(user);
        setIsEditing(true);
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
        setCurrentUser(null);
    }


    return (
        <div className="min-h-screen bg-gray-200">
          <nav className="bg-indigo-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold">Admin Dashboard</span>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
    
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <button
                  onClick={handleAddUser}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add User
                </button>
              </div>
    
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
    
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
    
              {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user._id}>
                            <td className="py-2 px-4 border-b border-gray-200">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                                  <img
                                    src={user.profileImage || '/default-avatar.png'}
                                    alt={user.username}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span>{user.username}</span>
                              </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center border-b border-gray-200">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
    
          {showModal && (
            <UserModal
              user={currentUser}
              isEditing={isEditing}
              onClose={closeModal}
            />
          )}
        </div>
      );
    };


export default Dashboard
