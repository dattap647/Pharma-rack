import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { getRole, isLoggedIn } from '../auth/index';
import AdminPrivateRoute from '../Routes/AdminPrivateRoute';
import UserPrivateRoute from '../Routes/UserPrivateRoute';

const PrivateRoute=()=>{
    const role=getRole()
    return isLoggedIn()? role===1?<Navigate to={"/admin"} replace/>:<Navigate to={"/user"} replace/> : <Navigate to={"/login"} />
}

export default PrivateRoute;
