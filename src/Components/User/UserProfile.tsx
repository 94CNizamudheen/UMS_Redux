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
    <div>
      <div>
        <h2>User Profile</h2>
        <div>
          <div>
            <img src={uploadedImage||user?.profileImage} alt="Profile Image" />
            {isUploading && (
              <div>
                <div></div>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="profileImage">Upload new Image</label>
            <input type="file" id='profileImage' name='profileImage' accept='image/*' onChange={handleImageUpload} className='hidden'/>
          </div>
          {uploadeError && (
            <div>{uploadeError}</div>
          )}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="username" id='username' name='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            {formik.values.username && formik.errors.username ?(
              <div>{formik.errors.username}</div>
            ):null}
              
            
          </div>
          <div>
            <label htmlFor="email">Username</label>
            <input type="email" id='email' name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            {formik.values.email && formik.errors.email ?(
              <div>{formik.errors.email}</div>
            ):null}
          </div>
          <div>
            <button type='submit' >Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfile
