import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Container } from "reactstrap";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import PrivateRoute from './Routes/PrivateRoute'
import UserPrivateRoute from './Routes/UserPrivateRoute'
import AdminPrivateRoute from './Routes/AdminPrivateRoute'



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
