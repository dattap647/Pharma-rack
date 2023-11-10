import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Container } from "reactstrap";
import EmployeeComponent from "./Components/EmployeeComponent";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import UserDashboard from "./pages/Users/UserDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import TimeCardViewer from "./pages/Users/TimeCardViewer";
import Attendance from "./pages/Users/Attendance";
import ManageEmployee from "./pages/Users/ManageEmployee";
import ManagerChangeRequest from "./pages/Users/ManagerChangeRequest";
import AdminPrivateRoute from "./Routes/AdminPrivateRoute";
import UserPrivateRoute from "./Routes/UserPrivateRoute";

function App() {
  return (
    <Container>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home/*" element={<PrivateRoute />} />
          <Route path="/admin/*" element={<AdminPrivateRoute />} />
          <Route path="/user/*" element={<UserPrivateRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
