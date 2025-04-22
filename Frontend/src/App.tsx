
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { store } from "./App/store"
import { Navigate } from 'react-router-dom';
import { Provider } from "react-redux"
import Login from "./Components/Auth/Login"
import Register from "./Components/Auth/Register"
import PrivateRoute from "./Components/Routing/PrivateRoute"
import Home from "./Components/User/Home"
import Dashboard from './Components/Admin/Dashboard'
import UserProfile from './Components/User/UserProfile';



const App: React.FC = () => {



  return (
    <Provider store={store} >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/admin/Dashboard" element={
            <PrivateRoute requireAdmin={true}>
              <Dashboard />
            </PrivateRoute>
          }
          />

          <Route path="/profile" element={
            <PrivateRoute >
              <UserProfile />
            </PrivateRoute>
          }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
