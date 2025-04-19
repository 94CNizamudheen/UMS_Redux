import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../App/hooks'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Features/Auth/authSlice';
import { Link } from 'react-router-dom';



const Home:React.FC = () => {
  const dispatch=useAppDispatch();
  const navigate=useNavigate();
  const {user,isAuthenticated}=useAppSelector((state)=>state.auth);


  useEffect(()=>{
    if(!isAuthenticated){
      navigate('/login')
    };

    if(user?.role==='admin'){
      navigate('/admin/dashboard')
    }

  },[navigate,isAuthenticated,user])

  const handleLogout=()=>{
    dispatch(logout());
    navigate('/login')
  }


  return (
    <div>
      <nav>
        <div>
          <div>
            <div>
              <div>
                <span>User Portel</span>
              </div>
            </div>
            <div>
              <Link to={'/profile'}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <div>
          <h1 > Welcome,{user?.username}!</h1>
          <div>
            <h2>Your Account details</h2>
            <div>
              <p>Email:</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p>Account Created:</p>
              <p>{user?.createdAt?new Date(user.createdAt).toLocaleDateString(): 'N/A' }</p>
            </div>
          </div>
        </div>
        <div>
          <Link to="/profile">Update your profile</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
