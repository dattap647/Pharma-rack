import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "reactstrap";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import CustomNavbar from "./CustomNavbar";
import { getAllManagers, signUp } from "../auth/user-service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "3", // Default role selection 3-user 2-manager
    manager_id: "", // Initialize manager_id
    managerList: [],
  });
  const [roles, setRoles] = useState("User");

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const fetchManager = () => {
    getAllManagers()
      .then((response) => {
        setData({ ...data, managerList: response.data });
      })
      .catch((error) => {
        toast.error(error);
        setError(error);
      });
  };
  useEffect(() => {
    if (data.role_id === "3") {
      // Fetch the list of managers when the role is 'User'
      fetchManager();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.role_id]);
  const handleForReset = () => {
    setData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_id: "3", // Default role selection 3-user 2-manager
      manager_id: "", // Initialize manager_id
      managerList: [],
    });
    if (data.role_id === "3") {
      // Fetch the list of managers when the role is 'User'
      fetchManager();
    }
  };
  const submitForm = (event) => {
    event.preventDefault();
    if (error.isError) {
      toast.error("Form data is invalid!!!");
      return;
    }
    if (data.manager_id === "") {
      toast.info("Please select the Manager");
      return;
    }
    signUp(data)
      .then((resp) => {
        toast.success("You are Registered Successfully!");
        navigate("/login");
      })
      .catch((error) => {
        const msg = error.response.data.error.split("CustomError:")[1];
        const msgArray = msg.split(";");
        msgArray.map((m) => toast.error(m));
      })
      .finally(() => {
        handleForReset();
      });
  };

  const handleChange = (event, property) => {
    if (property === "role_id") {
      const selectedRole = event.target.value;
      if (selectedRole === "User") {
        const roleId = "3";
        setRoles(selectedRole);
        setData({
          ...data,
          role_id: roleId,
          manager_id: "", // Clear the manager_id when the role changes
        });
      } else {
        const roleId = "2";
        setRoles(selectedRole);
        setData({
          ...data,
          role_id: roleId,
          manager_id: null, // Clear the manager_id when the role changes
          selectedManager: "", //clear the selected Manager if role is manager
        });
      }
    } else if (property === "selectedManager") {
      // Set the manager_id value
      setData({
        ...data,
        manager_id: event.target.value,
        selectedManager: event.target.value,
      });
    } else {
      setData({ ...data, [property]: event.target.value });
    }
  };
  return (
    <MDBContainer fluid>
      <CustomNavbar />

      <MDBRow className="g-1 align-items-center mx-2 my-2">
        <MDBCol col="6">
          <MDBCard>
            <MDBCardBody className="p-5 shadow-5 text-left">
              <center>
                <h4 className="center">Hey User!</h4>
                <h2 className="fw-bold mb-3">Sign up now</h2>
                <FontAwesomeIcon
                  icon={faUserAstronaut}
                  style={{ fontSize: "24px", marginBottom: "10px" }}
                />
              </center>
              <Form onSubmit={submitForm}>
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="First name"
                      id="first_name"
                      type="text"
                      y
                      onChange={(e) => handleChange(e, "first_name")}
                      value={data.first_name}
                      required
                    />
                  </MDBCol>

                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Last name"
                      type="text"
                      id="last_name"
                      onChange={(e) => handleChange(e, "last_name")}
                      value={data.last_name}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  type="email"
                  required
                  id="email"
                  onChange={(e) => handleChange(e, "email")}
                  value={data.email}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  required
                  type="password"
                  id="password"
                  onChange={(e) => handleChange(e, "password")}
                  value={data.password}
                />

                <MDBRow className="mb-5">
                  <MDBCol>
                    <Input
                      name="selectRole"
                      type="select"
                      value={roles}
                      onChange={(e) => handleChange(e, "role_id")}
                      id="role_id"
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                    </Input>
                  </MDBCol>
                  {roles === "User" && (
                    <MDBCol>
                      <Input
                        name="selectManager"
                        type="select"
                        value={data.selectedManager}
                        onChange={(e) => handleChange(e, "selectedManager")}
                        id="selectedManager"
                      >
                        <option value="">Select a Manager</option>
                        {data.managerList.map((manager) => (
                          <option key={manager.user_id} value={manager.user_id}>
                            {manager.first_name} {manager.last_name}
                          </option>
                        ))}
                      </Input>
                    </MDBCol>
                  )}
                </MDBRow>

                <Button
                  className="w-100  mb-4 fw-bold "
                  style={{ background: "#687EFF" }}
                  size="md"
                >
                  SIGN UP
                </Button>
                {/* <p className=" mb-3 pb-lg-3 ms-5" onClick={handleForReset} ><a class="text-muted">Reset</a></p>*/}
              </Form>

              <div className="text-center">
                <p className="ms-5 ">
                  Already have an account?{" "}
                  <a href="Login" style={{ color: "#687EFF" }}>
                    Login{" "}
                  </a>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol col="6">
          <img
            src={require("../assets/signUpImg.jpg")}
            class="w-100 rounded-4"
            alt=""
            fluid
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default SignUp;
