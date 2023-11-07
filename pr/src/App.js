import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import { Container } from 'reactstrap';
import CustomNavbar from './Components/CustomNavbar';
import EmployeeComponent from './Components/EmployeeComponent';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './Components/PrivateRoute';

import TimeCardViewer from './pages/TimeCardViewer';
import AllEmployee from './pages/ManageEmployee';
import Attendance from './pages/Attendance';
import ManageEmployee from './pages/ManageEmployee';
import ManagerChangeRequest from './pages/ManagerChangeRequest';


function App() {
  return (
    <Container>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/user" element={<PrivateRoute />} >
          <Route path="employee" element={<EmployeeComponent />} />
          <Route path="dashboard" element={<UserDashboard />} />
          
          <Route path="previousTimeCards" element={<TimeCardViewer />} />
          <Route path="managerDashboard" element={<ManagerChangeRequest/>} />
          <Route path="allEmployee" element={<ManageEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          </Route>

          
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
