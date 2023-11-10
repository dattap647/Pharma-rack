import React, { useEffect, useState } from "react";
import ActiveUser from "../../Components/ActiveUser";
import { getToken } from "../../auth";
import { Card, CardBody, CardTitle, Container, Input, Label } from "reactstrap";
import CustomNavbar from "../../Components/CustomNavbar";
import CustomButton from "../../Components/CustomButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageAllUser = () => {
  const [userlist, setUserList] = useState([]);
  const [filteruserlist, setFilterUserList] = useState([]);
  const [filterUser, setFilterUser] = useState("3");
  const [isUpdate, setisUpdate] = useState(false);
  const navigate=useNavigate()

  const apiUrl = `http://localhost:3001/attendance-management/v1/admin/users-list`;



  const fetchUserList = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Console Response... ", response.data.data);
      if (response.data.success) {
        setUserList(response.data.data);
        setFilterUserList(response.data.data.filter((u)=>u.role_id=== parseInt(filterUser)))
      } 
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [isUpdate]);

  useEffect(() => {
    setFilterUserList(userlist.filter((u)=>u.role_id=== parseInt(filterUser)))
  }, [filterUser])
  
  const handleUpdate = () => {
    setisUpdate(!isUpdate);
  };
  return (
    <Container fluid>
      <CustomNavbar />
      <div className="d-flex mt-3 mr-3 mx-3 justify-content-end">
        <CustomButton
          color="black"
          bgcolor="white"
          name={"Back"}
          onClick={()=>navigate(-1)}
        />
      </div>
      <Card className="my-2 mx-3">
        <CardBody>
          <CardTitle className="text-center h5">
            <h3>All Employee</h3>
            <div className="d-flex gap-2  w-25 align-items-baseline mx-4 my-2 ">
              <Label className="fw-bold ">Role:</Label>
              <Input
                type="select"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                <option value="Select Role">Select Role</option>
                <option value="2">Manager</option>
                <option value="3">User</option>
              </Input>
            </div>
          </CardTitle>
          <div className="row mx-4">
            <div className="col fs-5 fw-bold">Name</div>
            <div className="col fs-5 fw-bold">Email</div>
            <div className="col fs-5 fw-bold">Status</div>
            <div className="col fs-5 fw-bold">Role Id</div>
            {filterUser === "3" && (<div className="col fs-5 fw-bold">Manager Id</div>)}
            <div className="col fs-5 fw-bold">Action</div>
            <hr className="mx-2 my-2" />
          </div>
          <div
            style={{
              height: "550px",
              overflow: "auto",
              overflowWrap: "anywhere",
            }}
          >
            {filteruserlist.map((user) => {
              return (
                <ActiveUser
                  user={user}
                  key={user.user_id}
                  handleUpdate={handleUpdate}
                />
              );
            })}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ManageAllUser;
