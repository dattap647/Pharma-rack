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
  MDBInput,
  MDBBtn
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
        console.log("login user",data);
        // Save data to localStorage
        doLogin(data, () => {
          console.log('login detail saved to local storage');
          // Redirect to the user dashboard page
          navigate('/home');  
        });
        toast.success('Login Successful :)');
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400 || error.response.status === 404||error.response.status===401) {
          
          toast.error(error.response.data.error.split('CustomError:')[1]);
        } else {
          toast.error('Something went wrong!!!');
        }
      });  
  };
  return (
    <div>
      <CustomNavbar/>
      <MDBContainer fluid className="p-4 g-1 align-items-center mx-2" >
      <MDBRow >
      <MDBCol sm='6' className='d-none d-sm-block px-0'>
      <img src={require('./medium.avif')}    alt="Login image" className="w-100 h-100 rounded-1" style={{objectFit: 'fit', objectPosition: 'left'}} />
      </MDBCol>
        <MDBCol sm='6'>
         <MDBCard>
         
         <MDBCardBody className='p-5  text-left'>
         <div className='d-flex flex-column justify-content-center align-items-center '>
         <FontAwesomeIcon icon={faUserAstronaut} style={{fontSize:'24px'}} />
         <h3 className="fw-bold mb-3 " style={{letterSpacing: '1px'}}>Login Here</h3>
         </div>


           <Form onSubmit={handleForSubmit}>
           <MDBInput wrapperClass='mb-4'  size="lg" l
           label="Your Email"
           id="email"
           onChange={(e) => handleChange(e, "email")}
           value={loginDetail.email}
           className="w-100 inputD"
           required
           />
           <MDBInput
           
           label="Password"
           id="password"
           onChange={(e) => handleChange(e, "password")}
           value={loginDetail.password}
           type="password"
           required
           className="inputD"
           wrapperClass='mb-4  ' 
            size="lg"/>

           <Button className=" w-100 mb-3 fw-bold " style={{background:"#687EFF"}}  type="submit" >LOGIN</Button>
         
           </Form>
           <div className="d-flex flex-column align-items-center ">
           <p className=" mb-3 pb-lg-3 ms-5" onClick={handleForReset} ><a class="text-muted">Reset</a></p>
           <p className='ms-5 '>Don't have an account? <a href="SignUp" style={{color:"#687EFF"}}>Register here</a></p>
           </div>
         
         </MDBCardBody></MDBCard>
        </MDBCol>
      </MDBRow>
      </MDBContainer>
    </div>
  );

};

 

export default Login;



