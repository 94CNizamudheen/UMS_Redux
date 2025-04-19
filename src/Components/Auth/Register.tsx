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
      passWord: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      passWord: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('passWord')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values) => {
      const { username, email, passWord } = values;
      dispatch(register({ username, email, passWord }));
    },
  });


  return (
    <div>
      <div>
        <div>
          <div>
            <h2>Create your Account</h2>
          </div>
          {error && (
            <div>
              <span>{error}</span>
            </div>
          )}
          <form action="" onSubmit={formik.handleSubmit}>
            <div>
              <div>
                <label htmlFor="username">Username</label>
                <input type="text" id='username' name='username' autoComplete='username' required
                placeholder='Username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.username && formik.errors.username ?(
                  <div>{formik.errors.username}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' placeholder='Email' autoComplete='email' required
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.values.email && formik.errors.email ?(
                  <div>{formik.errors.email}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="password">Email</label>
                <input type="password" id='password' name='password' placeholder='Password' autoComplete='password' required
                value={formik.values.passWord} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.values.passWord && formik.errors.passWord ?(
                  <div>{formik.errors.passWord}</div>
                ):null}
              </div>
              <div>
                <label htmlFor="confirmPassword">Email</label>
                <input type="password" id='confirmPassword' name='confirmPassword' placeholder='Confirm Password' autoComplete='confirmPassword' required
                value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.values.confirmPassword && formik.errors.confirmPassword ?(
                  <div>{formik.errors.confirmPassword}</div>
                ):null}
              </div>
            </div>
            <div>
              <button type='submit' disabled={isLoading}  >
                {isLoading? "Registering.." :"Register"}
              </button>
            </div>
          </form>
          <div>
            <p>
            Already have an account ?{" "}
            <button type='button' onClick={()=>navigate('/login')}></button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
