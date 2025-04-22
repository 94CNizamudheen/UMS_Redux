/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { useFormik } from 'formik';
import { updateUser } from '../../Features/Users/userSlice';
import { loadUser } from '../../Features/Auth/authSlice';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading: usersLoading } = useAppSelector((state) => state.users);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  console.log('profile image ', user?.profileImage);

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      if (user) {
        const userData = {
          ...values,
          profileImage: uploadedImage || user.profileImage,
        };
        console.log('Dispatching updateUser with:', userData);
        try {
          await dispatch(
            updateUser({
              userId: user._id,
              userData,
            })
          ).unwrap();
          // Redirect to home page after successful update
          navigate('/');
        } catch (error) {
          console.error('Update failed:', error);
          // Optionally set an error message for the user
          setUploadError('Failed to update profile. Please try again.');
        }
      }
    },
    enableReinitialize: true,
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size should not exceed 2MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setUploadError('Only JPEG, PNG, and GIF images are allowed');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data.secure_url);
      if (data.secure_url) {
        setUploadedImage(data.secure_url);
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error: any) {
      setUploadError('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 relative">
            {usersLoading ? (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <img
                src={uploadedImage || user?.profileImage || 'https://via.placeholder.com/150'}
                alt="Profile Image"
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
              />
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Upload new Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {uploadError && <div className="text-red-500 text-sm mb-4">{uploadError}</div>}
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={usersLoading || isUploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;