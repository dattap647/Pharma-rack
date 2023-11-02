import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, CardHeader, Container, CardBody, Form, Input, Label } from 'reactstrap';
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import CustomNavbar from "./CustomNavbar";
import { signUp } from "../auth/user-service";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { getRole } from "../auth/index";

const SignUp = () => {
  const role = getRole();

  const navigate = useNavigate();
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '3', // Default role selection 3-user 2-manager 
    manager_id: '', // Initialize manager_id
    managerList: [],
  });
  const [roles,setRoles]=useState('User')

  
  const [error, setError] = useState({
    errors: {},
    isError: false
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (data.role_id === '3') {
      // Fetch the list of managers when the role is 'User'
      fetchManagerList();
      
    }
  }, [data.role_id]);

  const apiUrl = `http://localhost:3001/attendance-management/v1/auth/manager-list`;

  const fetchManagerList = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log("Console Response... ", response);
      if (response.data.success) {
        setData({ ...data, managerList: response.data.data });
      } else {
        console.error('Failed to fetch manager list');
      }
    } catch (error) {
      console.error('Error fetching manager list:', error);
    }
  };

  const submitForm = (event) => {
    event.preventDefault();

    if (error.isError) {
      toast.error("Form data is invalid!!!");
      return;
    }

    console.log(data);

    signUp(data).then((resp) => {
      console.log(resp);
      console.log("Success log");
      toast.success("You are Registered Successfully!");
      navigate('/login');

    }).catch((error) => {
      console.log(error);
      console.log("Error log",error);
      //  toast.error(error);
      setError({
        errors: error,
        isError: true
      });
    })
    .finally(()=>{
      setError({
        errors: {},
        isError: false
      });
      handleReset()
    }
  );
  }
  const handleReset=()=>{
    setData({ first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '3', // Default role selection 3-user 2-manager 
    manager_id: '', // Initialize manager_id
    managerList: [],})
    if (data.role_id === '3') {
      // Fetch the list of managers when the role is 'User'
      fetchManagerList();
      
    }
  }
  const handleChange = (event, property) => {
    if (property === 'role_id') {
      const selectedRole = event.target.value;
      console.log(selectedRole);
      if(selectedRole==='User'){
        const roleId='3'
        setRoles(selectedRole)
    setData({
      ...data,
      role_id: roleId,
      manager_id: '', // Clear the manager_id when the role changes
    });
      }
      else{
        const roleId='2'
        setRoles(selectedRole)
      setData({
        ...data,
        role_id: roleId,
        manager_id: null,// Clear the manager_id when the role changes
        selectedManager:'' //clear the selected Manager if role is manager
      });
      }
    
    } else if (property === 'selectedManager') {
      console.log("manager_id",event.target.value);
      // Set the manager_id value
      setData({ ...data, manager_id: event.target.value,selectedManager:event.target.value });
    } else {
      // Handle other input fields
      // console.log("else block");
      setData({ ...data, [property]: event.target.value });
    }
  };
  return (
    <MDBContainer fluid className='p-2'>
      <CustomNavbar />
      <MDBRow>
        <MDBCol md='4' className='position-relative' style={{ marginRight: "10%" }}>
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
          <MDBCard className='my-5 bg-glass cardStyle' style={{ height: "90%" }}>
            <CardHeader>
              <h4 className="center">Hey User!</h4>
              <h3 className="center">Sign Up Here</h3>
              <FontAwesomeIcon icon={faUserAstronaut} style={{ fontSize: '24px' }} />
            </CardHeader>
            <MDBCardBody className='p-2'>
              <CardBody>
                <Form onSubmit={submitForm}>
                  <Label htmlFor="first_name">First Name</Label>
                  <br></br>
                  <Input
                    type="text"
                    placeholder="Enter First Name"
                    id="first_name"
                    onChange={(e) => handleChange(e, 'first_name')}
                    value={data.first_name}
                    className="inputLogin"
                  />
                  <br></br>
                  <Label htmlFor="last_name"> Last Name</Label>
                  <br></br>
                  <Input
                    type="text"
                    placeholder="Enter Last Name"
                    id="last_name"
                    onChange={(e) => handleChange(e, 'last_name')}
                    value={data.last_name}
                    className="inputLogin"
                  />
                  <br></br>
                  <Label htmlFor="email"> Email</Label>
                  <br></br>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    id="email"
                    onChange={(e) => handleChange(e, 'email')}
                    value={data.email}
                    className="inputLogin"
                  />
                  <br></br>
                  <Label htmlFor="password">Password</Label>
                  <br></br>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    id="password"
                    onChange={(e) => handleChange(e, 'password')}
                    value={data.password}
                    className="inputLogin"
                  />
                  <br></br>
                  <Label htmlFor="role_id">Select Role</Label>
                  <br></br>
                  <select
                    value={roles}
                    onChange={(e) => handleChange(e,'role_id')}
                    id="role_id"
                  >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <br></br>
                  {roles === 'User' && (
                    <div>
                      <Label htmlFor="selectedManager">Select Manager</Label>
                      <br></br>
                      <select
                        value={data.selectedManager}
                        onChange={(e) => handleChange(e, 'selectedManager')}
                        id="selectedManager"
                      >
                        <option value="">Select a Manager</option>
                        {data.managerList.map((manager) => (
                          <option key={manager.user_id} value={manager.user_id}>
                            {manager.first_name}  {manager.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <br></br>
                  <Container className="text-center">
                    <br></br>
                    <Button color="dark" className="btnLogin">Register</Button>
                    <Button color="secondary" className="ms-2 btnLogin" type="reset" value="Reset" onClick={handleReset}>Reset</Button>
                  </Container>
                </Form>
              </CardBody>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <img src={require('./signUpImg.jpg')} alt="medium" height="400px" width="650px" />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;