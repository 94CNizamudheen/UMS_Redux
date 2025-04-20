import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { clearError, register } from '../../Features/Auth/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register:React.FC=() => {

    const dispatch=useAppDispatch();
    const navigate=useNavigate()
    const {isAuthenticated,isLoading,error,user}= useAppSelector((state)=>state.auth);
  
    useEffect(()=>{
      // Clear any previous errors when component mounts
      dispatch(clearError())
    },[dispatch]);

    useEffect(()=>{
      if(isAuthenticated && user){
        navigate('/home');
      }
    },[isAuthenticated,navigate,user]);


  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values) => {
      
      const { username, email, password } = values;
      dispatch(register({ username, email, password }));
      navigate("/login")
    },
  });


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* <div> */}
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Create your Account</h2>
          </div>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
              <span className='block sm:inline'>{error}</span>
            </div>
          )}
          <form action="" onSubmit={formik.handleSubmit} className='mt-8 space-y-6'>
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text" id='username' name='username' autoComplete='username' required
                placeholder='Username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                {formik.touched.username && formik.errors.username ?(
                  <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" id='email' name='email' placeholder='Email' autoComplete='email' required
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'  />
                {formik.values.email && formik.errors.email ?(
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" id='password' name='password' placeholder='Password' autoComplete='new-password' required
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"  />
                {formik.values.password && formik.errors.password ?(
                  <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Email</label>
                <input type="password" id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' autoComplete='new-password' required
                value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'  />
                {formik.values.confirmPassword && formik.errors.confirmPassword ?(
                  <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                ):null}
              </div>
            </div>
            <div>
              <button type='submit' disabled={isLoading} 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                {isLoading? "Registering.." :"Register"}
              </button>
            </div>
          </form>
          <div>
            <p className="mt-2 text-sm text-gray-600">
            Already have an account ?{" "}
            <button type='button' onClick={()=>navigate('/login')} 
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Sign in</button>
            </p>
          </div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Register
