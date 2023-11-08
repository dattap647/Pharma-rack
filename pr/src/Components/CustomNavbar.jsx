import React, { useEffect, useState } from 'react';

import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { doLogout, getCurrentUserDetail, isLoggedIn } from '../auth/index';
import { useNavigate } from 'react-router-dom';

function CustomNavbar(props) {
  let navigate = useNavigate()
  const[login,setLogin] = useState(false)
  const[user,setUser] = useState(undefined)

  useEffect(()=>{
    setLogin(isLoggedIn())
    setUser(getCurrentUserDetail())
  },[login])

  const logout =()=>{
    doLogout(()=>{
      //logged out
      setLogin(false);
      navigate("/login")
    })
  }

  return (

    <div>

      <Container fluid>

        <Navbar style={{ boxShadow:"2px 1px 5px lightblue"}} color=" rounded-bottom-2" expand="md">

          <NavbarBrand href="/"  className='fw-bold fs-5' >PharmaRack</NavbarBrand>

        
          <Nav navbar className='fw-bold fs-6'>
            {
              login && (
                <>
                <NavItem>

                <NavLink href="/user/employee" > Time Card</NavLink>
  
              </NavItem>
                <NavItem>
                <NavLink  onClick={logout}>Logout</NavLink>
              </NavItem>
            
              {/* <NavItem>
                <NavLink>{user.email}</NavLink>
              </NavItem> */}
              </>
              )
            }
            
            {
              !login &&(
                <NavItem>
                <NavLink href="/login">Login</NavLink>
                </NavItem>
              )
            }

          </Nav>
        </Navbar>
      </Container>
    </div>
  );

}

export default CustomNavbar;