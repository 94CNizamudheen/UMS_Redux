import React, { useEffect } from 'react'
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
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        }
    }, [isAuthenticated, user, navigate]);


    const formik = useFormik({
        initialValues: {
            email: '',
            passWord: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('invalid email address').required('Required'),
            passWord: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            dispatch(login(values))
        }

    })


    return (
        <div>
            <div>
                <div>
                    <h2>Sign in to your account</h2>
                </div>
                {error && (
                    <div>
                        <span>{error}</span>
                    </div>
                )}
                <form action="" onSubmit={formik.handleSubmit}>
                    <div>
                        <div>
                        <label htmlFor="email">Email address</label>
                        <input type="email" id='email' name='email' autoComplete='email' required placeholder='Email address'
                            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.email && formik.errors.email ? (
                            <div>{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' name='password' autoComplete='current-password' 
                        required value={formik.values.passWord} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.touched.passWord && formik.errors.passWord ?(
                            <div>{formik.errors.passWord}</div>
                        ):null}
                        </div>
                    </div>
                    <div>
                        <button type='submit' disabled={isLoading}>
                        {isLoading ? 'Signing in..':"Sign in"}
                        </button>
                    </div>
                </form>
                <div>
                    <p>Don't have an account?{" "}
                        <button type='button' onClick={()=>navigate('/register')}>Register</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
