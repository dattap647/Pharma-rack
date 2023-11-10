import React, { useState, useEffect } from "react";
import { Table, Button, Container, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import CustomNavbar from "../../Components/CustomNavbar";
import { formatDate } from "../../utils/helper";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import FilterStatus from "../../Components/FilterStatus";
import { toast } from "react-toastify";
import { getUserAttendanceForManagerUrl } from "../../auth/constants";
import {
  HandleAttendanceStatus,
  fetchUserAttendance,
} from "../../auth/user-service";
import { getRole } from "../../auth";

const AllAttendance = () => {
  const role = getRole();
  const [status, setStatus] = useState("Pending");
  const [filteruserlist, setFilterUserList] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, [status]);

  const fetchUsers = () => {
    fetchUserAttendance(status)
      .then((response) => {
        setFilterUserList(response.data.filter((u) => u.status === status));
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleApproveReject = (attendanceId, newStatus) => {
    HandleAttendanceStatus(attendanceId, newStatus)
      .then((response) => {
        newStatus === "Rejected"
          ? toast.error(response.data[0])
          : toast.success(response.data[0]);

        fetchUsers();
      })
      .catch((error) => {
        toast.error(error.response.data.error.split("CustomError:")[1]);
      });
  };

  return (
    <div>
      <CustomNavbar />
      <Container>
        <h2 className="mt-5 d-flex justify-content-center">
          All Attendance Record
        </h2>
        <FilterStatus status={status} setStatus={setStatus} />
        <MDBCard className="mb-4">
          <MDBCardBody>
            {filteruserlist.length > 0 ? (
              <Table borderless>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    {status === "Pending" || role == 1 ? (
                      <th>Actions</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {filteruserlist.map((user) => (
                    <tr key={user.attendance_id}>
                      <td>{user.user_id}</td>
                      <td>{formatDate(user.date)}</td>
                      <td>{user.status}</td>

                      {role === 1 || status === "Pending" ? (
                        status === "Pending" ? (
                          <td>
                            <Button
                              onClick={() =>
                                handleApproveReject(
                                  user.attendance_id,
                                  "Approved"
                                )
                              }
                              outline
                            >
                              Approve
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button
                              onClick={() =>
                                handleApproveReject(
                                  user.attendance_id,
                                  "Rejected"
                                )
                              }
                              outline
                            >
                              Reject
                            </Button>
                          </td>
                        ) : status === "Approved" ? (
                          <td>
                            <Button
                              onClick={() =>
                                handleApproveReject(
                                  user.attendance_id,
                                  "Rejected"
                                )
                              }
                              outline
                            >
                              Reject
                            </Button>
                          </td>
                        ) : status === "Rejected" ? (
                          <td>
                            <Button
                              onClick={() =>
                                handleApproveReject(
                                  user.attendance_id,
                                  "Approved"
                                )
                              }
                              outline
                            >
                              Approve
                            </Button>
                          </td>
                        ) : null
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center my-4 fs-5 fw-bold">
                No {status} Request
              </p>
            )}
          </MDBCardBody>
        </MDBCard>
      </Container>
    </div>
  );
};

export default AllAttendance;
