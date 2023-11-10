import React from "react";
import { Container } from "reactstrap";
import CustomNavbar from "../../Components/CustomNavbar";
import RouterCard from "../../Components/RouterCard/RouterCard";

const AdminDashboard = () => {
  return (
    <Container>
      <CustomNavbar />
      <Container className=" mt-5 p-4 card">
        <h3 className="text-center my-3 fw-bold "> Admin</h3>
        <div className="row m-2">
          <div className="col">
            {" "}
            <RouterCard
              headText="Manage All Users"
              subText="View all Employee"
              to="/admin/manageusers"
            />
          </div>
          <div className="col">
            {" "}
            <RouterCard
              headText="Managers"
              subText="View all Managers"
              to="/admin/managers"
            />
          </div>
        </div>
        <div className="row m-2">
          <div className="col">
            <RouterCard
              to="/admin/chnagemanagerrequest"
              headText="Approve Manager Request"
              subText="Change Manager Request from Employee"
            />
          </div>
          <div className="col">
            <RouterCard
              to="/admin/attendance-records"
              headText="Attendance Records"
              subText="Attendance Request from Employee"
            />
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default AdminDashboard;
