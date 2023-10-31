import React, { useState } from "react";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import {Button,CardHeader,Container,CardBody,Form} from 'reactstrap'
import CustomNavbar from "./CustomNavbar";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doLogin } from "../auth/index";
import { loginUser } from "../auth/user-service";

 

const Login = () => {
  const navigate = useNavigate();
  const [loginDetail, setLoginDetail] = useState({ email: '', password: '' });
  const handleChange = (event, field) => {
  setLoginDetail({ ...loginDetail, [field]: event.target.value });
  };

  const handleForReset = () => {
    setLoginDetail({ email: '', password: '' });
  };
  const handleForSubmit = (event) => {
    event.preventDefault();
    console.log(loginDetail);
    loginUser(loginDetail)
      .then((data) => {
        console.log('user login:');
        console.log(data);
        // Save data to localStorage
        doLogin(data, () => {
          console.log('login detail saved to local storage');
          // Redirect to the user dashboard page
          navigate('/user/employee');  
        });
        toast.success('Login Successful :)');
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400 || error.response.status === 404) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Something went wrong!!!');
        }
      });  
  };
  return (
    <div>
      <CustomNavbar/>
      <MDBContainer fluid className="p-4">
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
        <img src={require('./medium.avif')} alt="medium" height="400px" width="650px"/>
        </MDBCol>
        <MDBCol md='4' className='position-relative' style={{marginLeft:"150px"}}>
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass cardStyle'>
                <CardHeader>
                    <h3 className="center">Login Here</h3>
                    <FontAwesomeIcon icon={faUserAstronaut} style={{fontSize:'24px'}} />
                </CardHeader>
          <MDBCardBody className='p-4'>
                <CardBody>
                <Form onSubmit={handleForSubmit}>
                  <div className="d-flex flex-row align-items-center  ">
                    <MDBIcon fas icon="user me-3" size="lg" />
                    <MDBInput
                      label="Your Email"
                      id="email"
                      onChange={(e) => handleChange(e, "email")}
                      value={loginDetail.email}
                      className="w-100 inputD"
                      required
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center ">
                    <MDBIcon fas icon="lock me-3" size="lg" />
                    <MDBInput
                      label="Password"
                      id="password"
                      onChange={(e) => handleChange(e, "password")}
                      value={loginDetail.password}
                      type="password"
                      required
                      className="inputD"
                    />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-3 ">
                    <button
                      type="submit"
                      className="btn btn-primary mr-5 align-center button"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft:"20px",
                        width:"210px"
                      }}
                    >
                     Login
                    </button>
                   </div>
                    <br></br>
                <Container className='text-center'>
                    <Button color="dark" outline>Login</Button>
                    <Button onClick={handleForReset} className='ms-2 dark' color='dark' outline>Reset</Button>
                </Container>
               
                <Container className="mt-2">
                    <Button className='ms-2 ' color='dark' outline href='SignUp'>New User? Register Here</Button>
                </Container>
                    </Form>
                </CardBody>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
      </MDBContainer>
    </div>
  );

};

 

export default Login;