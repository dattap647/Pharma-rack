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

        <Navbar dark color="dark" expand="md">

          <NavbarBrand href="/">PharmaRack</NavbarBrand>

          <Nav className="me-auto" navbar>

            <NavItem>

              <NavLink href="/user/employee">TimeCard</NavLink>

            </NavItem>
          </Nav>
          <Nav navbar>
            {
              login && (
                <>
                <NavItem>
                <NavLink onClick={logout}>Logout</NavLink>
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