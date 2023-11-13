import React, { useEffect, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { doLogout, getRole, isLoggedIn } from "../auth/index";
import { useNavigate } from "react-router-dom";

function CustomNavbar(props) {
  const role = getRole();
  let navigate = useNavigate();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    setLogin(isLoggedIn());
  }, [login]);

  const logout = () => {
    doLogout(() => {
      //logged out
      setLogin(false);
      navigate("/login");
    });
  };

  return (
    <div>
      <Container fluid>
        <Navbar
          style={{ boxShadow: "2px 1px 5px lightblue" }}
          color=" rounded-bottom-2"
          expand="md"
        >
          <NavbarBrand href="/" className="d-flex align-items-center">
            <img
              src={require("../assets/pharmarack.png")}
              width="80px"
              alt="pharamack-logo"
            />
            <img
              src={require("../assets/persistent.png")}
              width="150px"
              height="50px"
              alt="persistent-logo"
            />
          </NavbarBrand>

          <Nav navbar className="fw-bold fs-6">
            {login && (
              <>
                {role === 1 ? null : (
                  <NavItem>
                    <NavLink href="/user/employee"> Time Card</NavLink>
                  </NavItem>
                )}
                <NavItem>
                  <NavLink onClick={logout}>Logout</NavLink>
                </NavItem>

                {/* <NavItem>
                <NavLink>{user.email}</NavLink>
              </NavItem> */}
              </>
            )}

            {!login && (
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
            )}
          </Nav>
        </Navbar>
      </Container>
    </div>
  );
}

export default CustomNavbar;
