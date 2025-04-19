import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from "./App/store"
import { loadUser } from "./Features/Auth/authSlice"
import { Provider } from "react-redux"
import Login from "./Components/Auth/Login"
import Register from "./Components/Auth/Register"
import PrivateRoute from "./Components/Routing/PrivateRoute"
import Home from "./Components/User/Home"




const App: React.FC = () => {

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.dispatch(loadUser())
    }
  }, [])

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
        }/>
        {/* <Route path="/profile" element= {
          <PrivateRoute requireAdmin={true}>
            <Dashboard/>
          </PrivateRoute>
        }
        /> */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
