
import { useAppDispatch, useAppSelector } from '../../App/hooks'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Features/Auth/authSlice';
import { Link } from 'react-router-dom';



const Home:React.FC = () => {
  const dispatch=useAppDispatch();
  const navigate=useNavigate();
  const {user}=useAppSelector((state)=>state.auth);




  const handleLogout=()=>{
    dispatch(logout());
    navigate('/login')
  }


  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">{user?.role==="admin" ? "Admin portal ": "User Portal" }</span>
              </div>
            </div >
            <div className="flex items-center">
              <Link to={'/profile'}  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium" >profile</Link>
              <button onClick={handleLogout} className="ml-4 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6" > Welcome,{user?.username}!</h1>
          <div className="bg-gray-50 p-4 rounded-md mb-6" >
            <h2 className="text-xl font-semibold mb-2">Your Account details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Account Created:</p>
              <p className="font-medium">{user?.createdAt?new Date(user.createdAt).toLocaleDateString(): 'N/A' }</p>
            </div>
          </div>
        </div>
        <div>
         {
          user?.role === "admin" ? ( <Link to="/admin/Dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Go to dashboard
          </Link>):( <Link to="/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Go to profile
          </Link>)
         }
        </div>
      </div>
    </div>
  )
}

export default Home
