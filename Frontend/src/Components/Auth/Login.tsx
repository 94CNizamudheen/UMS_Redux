import React, { useEffect, } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks'
import { useNavigate } from 'react-router-dom';
import { clearError, login } from '../../Features/Auth/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup'

const Login: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, error, user } = useAppSelector((state) => state.auth);




    useEffect(() => {
        // Clear any previous errors when component mounts
        dispatch(clearError())
         
    }, [dispatch]);

    useEffect(() => {
        // Redirect based on role if authenticated
        if (isAuthenticated && user) {
                navigate('/home');
        }
    }, [isAuthenticated, user, navigate]);


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            dispatch(login({ email: values.email, password: values.password }));
            
        }

    })


    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-200 py-12 px-4 sm:px-6 lg:px:8'>
            <div className='max-w-md w-full space-y-8'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-800 '>Sign in to your account</h2>
                </div>
                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                        <span className='block sm:inline'>{error}</span>
                    </div>
                )}
                <form action="" onSubmit={formik.handleSubmit} className='mt-8 space-y-8'>
                    <div>
                        <div>
                        <label htmlFor="email" className=''>Email address</label>
                        <input type="email" id='email' name='email' autoComplete='email'  placeholder='Email address'
                            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' />
                        {formik.touched.email && formik.errors.email ? (
                            <div className='text-red-500 text-xs mt-1'>{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' name='password' autoComplete='current-password' 
                        required value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'/>
                        {formik.touched.password && formik.errors.password ?(
                            <div className='text-red-500 text-xs mt-1'>{formik.errors.password}</div>
                        ):null}
                        </div>
                    </div>
                    <div>
                        <button type='submit' disabled={isLoading}
                        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        {isLoading ? 'Signing in..':"Sign in"}
                        </button>
                    </div>
                </form>
                <div className='text-center'>
                    <p className="mt-2 text-sm text-gray-600">Don't have an account?{" "}
                        <button type='button' onClick={()=>navigate('/register')} className='font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer'>Register</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
