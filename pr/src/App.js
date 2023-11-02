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
import AllManagers from './pages/AllManagers';
import ManagerDashboard from './pages/ManagerDashboard';
import TimeCardViewer from './pages/TimeCardViewer';
import AllEmployee from './pages/AllEmployee';


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
          <Route path="managers" element={<AllManagers />} />
          <Route path="previousTimeCards" element={<TimeCardViewer />} />
          <Route path="managerDashboard" element={<ManagerDashboard />} />
          <Route path="allEmployee" element={<AllEmployee />} />
          </Route>

          
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
