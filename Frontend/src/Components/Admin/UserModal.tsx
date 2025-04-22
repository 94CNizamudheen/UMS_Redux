// src/components/admin/UserModal.tsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../App/hooks';
import { createUser, fetchUsers, updateUser } from '../../Features/Users/userSlice';
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
    onSubmit: async (values) => {
      const userData = { ...values };

      // Remove password if it's empty (for editing)creste user
      if (isEditing && !values.password) {
        delete user?.password;
      }

      if (isEditing && user) {
        await dispatch(updateUser({ userId: user._id, userData }));
      } else {
        await dispatch(createUser(userData));
      }
      dispatch(fetchUsers())
      onClose();
    },
  });


  return (
    <div className="fixed   bg-opacity-50 flex backdrop-blur-sm justify-center items-center  z-10 inset-0 overflow-y-auto">
      <div className="bg-sky-950 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-amber-50">
          {isEditing ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              name="username"
              type="text"
              className={`w-full border border-gray-300 text-amber-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.username && formik.errors.username ? 'border-red-500' : ''
                }`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className={`w-full border text-amber-50 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              className={`w-full border text-amber-50 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                } ${isEditing ? 'bg-gray-800 cursor-not-allowed' : ''}`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required={!isEditing}
              disabled={isEditing}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>


          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              name="role"
              className={`w-full border text-gray-400 border-gray-300 px-3 py-2 rounded-md bg-sky-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.role && formik.errors.role ? 'border-red-500' : ''
                }`}
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default UserModal;