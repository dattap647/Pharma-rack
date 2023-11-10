import React from 'react'
import { Route, Routes } from 'react-router-dom'
import EmployeeComponent from '../Components/EmployeeComponent'
import UserDashboard from '../pages/Users/UserDashboard'
import TimeCardViewer from '../pages/Users/TimeCardViewer'
import ManagerChangeRequest from '../pages/Users/ManagerChangeRequest'
import ManageEmployee from '../pages/Users/ManageEmployee'
import Attendance from '../pages/Users/Attendance'

const UserPrivateRoute = () => {
  return (
<Routes >
<Route path="/" element={<EmployeeComponent />} />
<Route path="employee" element={<EmployeeComponent />} />
<Route path="dashboard" element={<UserDashboard />} />
<Route path="previousTimeCards" element={<TimeCardViewer />} />
<Route path="managerDashboard" element={<ManagerChangeRequest/>} />
<Route path="allEmployee" element={<ManageEmployee />} />
<Route path="attendance" element={<Attendance />} />
</Routes>
  )
}

export default UserPrivateRoute