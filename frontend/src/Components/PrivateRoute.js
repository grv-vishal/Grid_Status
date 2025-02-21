import React,{useContext} from 'react'
import { Navigate } from 'react-router-dom';
import { AppContext } from './Authentication/authProvider';



const PrivateRoute = ({children}) => {
   const{loginState} =useContext(AppContext)
    if(loginState)
        return children;
    else
     return <Navigate to="/login"/>
     
}

export default PrivateRoute
