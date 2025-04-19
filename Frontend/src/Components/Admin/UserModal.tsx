// src/components/admin/UserModal.tsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../App/hooks';
import { createUser, updateUser } from '../../Features/Users/userSlice';
import { User } from '../../Types';

interface UserModalProps {
  user: User | null;
  isEditing: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isEditing, onClose }) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'user',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: isEditing
        ? Yup.string() // Password is optional when editing
        : Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Required'),
    }),
    onSubmit: (values) => {
      const userData = { ...values };
      
      // Remove password if it's empty (for editing)
      if (isEditing && !values.password) {
        delete user?.password;
      }

      if (isEditing && user) {
        dispatch(updateUser({ userId: user._id, userData }));
      } else {
        dispatch(createUser(userData));
      }
      
      onClose();
    },
  });

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEditing ? 'Edit User' : 'Add New User'}
                </h3>
                <div className="mt-2">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      {formik.touched.role && formik.errors.role ? (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => formik.handleSubmit()}
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;