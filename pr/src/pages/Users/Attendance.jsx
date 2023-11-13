import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Container } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import CustomNavbar from "../../Components/CustomNavbar";
import { formatDate } from "../../utils/helper";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import FilterStatus from "../../Components/common/FilterStatus";
import { toast } from "react-toastify";

import {
  HandleAttendanceStatus,
  fetchUserAttendance,
} from "../../auth/user-service";

const Attendance = () => {
  const [status, setStatus] = useState("Pending");
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(() => {
    fetchUserAttendance(status)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        toast.error(e);
      });
  }, [status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, status]);

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
          Attendance Approval
        </h2>
        <FilterStatus status={status} setStatus={setStatus} />
        <MDBCard className="mb-4">
          <MDBCardBody>
            {users.length > 0 ? (
              <Table borderless>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    {status === "Pending" ? <th>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.attendance_id}>
                      <td>{user.user_id}</td>
                      <td>{formatDate(user.date)}</td>
                      <td>{user.status}</td>

                      {status === "Pending" && (
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
                      )}
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

export default Attendance;
