import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container } from "reactstrap";
import CustomNavbar from "../../Components/CustomNavbar";
import ActiveUser from "../../Components/common/ActiveUser";
import CustomButton from "../../Components/common/CustomButton";
import { getAllUsers } from "../../auth/user-service";
import { getuserlistForManagerUrl } from "../../auth/constants";

const ManageEmployee = () => {
  const [userlist, setUserList] = useState([]);
  const [isUpdate, setisUpdate] = useState(false);

  const fetchUserList = () => {
    getAllUsers(getuserlistForManagerUrl)
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching manager list:", error);
      });
  };

  useEffect(() => {
    fetchUserList();
  }, [isUpdate]);

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
          href="/user/employee"
        />
      </div>
      <Card className="my-2 mx-3">
        <CardBody>
          <CardTitle className="text-center h5">
            <h3>All Employee</h3>
          </CardTitle>
          <div className="row mx-4">
            <div className="col fs-5 fw-bold">Name</div>
            <div className="col fs-5 fw-bold">Email</div>
            <div className="col fs-5 fw-bold">Status</div>
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
            {userlist.map((user) => {
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

export default ManageEmployee;
