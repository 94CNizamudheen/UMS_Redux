import React from 'react'
import { useAppSelector } from '../../App/hooks';
import { Navigate } from 'react-router-dom';


interface PrivateRuteProps{
    children:React.ReactNode;
    requireAdmin?:boolean;
}


const PrivateRoute:React.FC<PrivateRuteProps> = ({children,requireAdmin=false}) => {
    const {isAuthenticated,user}=useAppSelector((state)=>state.auth);

    if(!isAuthenticated){
        return <Navigate to='/login' replace/>
    }
    if(requireAdmin && user?.role!=='admin'){
        return <Navigate to='/home' replace />
    }


  return <>{children}</>
}

export default PrivateRoute
