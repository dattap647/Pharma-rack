import React from 'react'
import EmployeeComponent from '../Components/EmployeeComponent'
import { Route, Routes } from 'react-router-dom'
import UserDashboard from '../pages/Users/UserDashboard'
import TimeCardViewer from '../pages/Users/TimeCardViewer'
import ManagerChangeRequest from '../pages/Users/ManagerChangeRequest'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import ManageAllUser from '../pages/Admin/ManageAllUser'
import Managers from '../pages/Admin/Managers'
import AllAttendance from '../pages/Admin/AllAttendance'

const AdminPrivateRoute = () => {
  return (
<Routes >
<Route path="/" element={<AdminDashboard/>} />
<Route path="manageusers" element={<ManageAllUser />} />
<Route path="managers" element={<Managers />} />
<Route path="chnagemanagerrequest" element={<ManagerChangeRequest/>} />
<Route path="attendance-records" element={<AllAttendance />} />
</Routes>
  )
}

export default AdminPrivateRoute