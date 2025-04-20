/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks'
import { useFormik } from 'formik';
import {updateUser} from '../../Features/Users/userSlice'
import * as Yup from 'yup'
import axios from 'axios';


const UserProfile:React.FC = () => {

    const dispatch=useAppDispatch();
    const {user}=useAppSelector((state)=>state.auth);
    const [uploadedImage,setUploadedImage]=useState<string|null>(null);
    const [uploadeError,setUploadError]=useState<string|null>(null);
    const [isUploading,setIsUploading]=useState(false);

    const formik=useFormik({
        initialValues:{
            username:user?.username||'',
            email:user?.email||''
        },
       validationSchema:Yup.object({
            username:Yup.string().required('Required'),
            email:Yup.string().email("Invalid email address").required('Required')
       }),
        onSubmit:(values)=>{
          if(user){
            dispatch(updateUser({
                userId:user._id,
                userData:{
                    ...values,
                    profileImage:uploadedImage||user.profileImage
                }
            }));
          }  
        },
        enableReinitialize:true
    });


    const handleImageUpload=async(event:React.ChangeEvent<HTMLInputElement>)=>{
      const file=event.target.files?.[0];
      if(!file)return;

      // Check file size (limit to 2MB)
      if(file.size>2*1024*1024){
        setUploadError('File size should not exceed 2MB');
        return;
      }
      //Check file type
      if(!['image/jpeg','image/png','image/gif'].includes(file.type)){
        setUploadError('Only JPEG, PNG, and GIF images are allowed');
        return;
      }
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData=new FormData();
        formData.append('profileImage',file)
        //Get token from redux state
        const token=localStorage.getItem('token');
        const response=await axios.post('api/users/upload-profile-image',formData,{
          headers:{
            'Content-Type':'multipart/form-data',
            Authorization:`Bearer ${token}`,
          },
        });
        setUploadedImage(response.data.imageUrl)
        return response.data;

      } catch (error:any) {
        setUploadError(error.response?.data?.message||"Failed to upload image")
      }finally{
        setIsUploading(false)
      }
    }



  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 relative">
            <img src={uploadedImage||user?.profileImage} alt="Profile Image"  className="w-full h-full rounded-full object-cover border-2 border-gray-200"/>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="profileImage" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">Upload new Image</label>
            <input type="file" id='profileImage' name='profileImage' accept='image/*' onChange={handleImageUpload} className='hidden' />
          </div>
          {uploadeError && (
            <div className="text-red-500 text-sm mb-4">{uploadeError}</div>
          )}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input type="username" id='username' name='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            {formik.values.username && formik.errors.username ?(
              <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
            ):null}
              
            
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input type="email" id='email' name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            {formik.values.email && formik.errors.email ?(
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ):null}
          </div>
          <div className="flex items-center justify-between">
            <button type='submit' className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfile
