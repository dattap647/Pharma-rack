/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CustomNavbar from "../../Components/CustomNavbar";
import { Container, Table } from "reactstrap";
import { formatDate } from "../../utils/helper";
import { toast } from "react-toastify";
import CustomButton from "../../Components/common/CustomButton";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import FilterStatus from "../../Components/common/FilterStatus";
import {
  UpdateManagerRequestsStatus,
  fetchManagerRequest,
} from "../../auth/user-service";

const ManagerChangeRequest = () => {
  const [status, setStatus] = useState("Pending");
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetchManagerRequest()
      .then((response) => {
        setUsers(response.data.filter((u) => u.status === status));
      })
      .catch((error) => {
        console.error("Error:", error.response.data.message);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [status]);

  const handleApproveReject = (userId, status) => {
    UpdateManagerRequestsStatus(userId, status)
      .then((response) => {
        status === "Rejected"
          ? toast.error(response.data)
          : toast.success(response.data);
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
        <h2 className="my-4 text-center">Manager Change Request</h2>
        <FilterStatus status={status} setStatus={setStatus} />
        <MDBCard>
          <MDBCardBody>
            {users.length > 0 ? (
              <Table borderless>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Request Date</th>
                    {status === "Approved" ? <th>Approval date</th> : null}
                    <th>Status</th>
                    {status === "Pending" ? <th>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    if (user.status === status) {
                      return (
                        <tr key={user.id}>
                          <td>{user.user_id}</td>
                          <td>{formatDate(user.request_date)}</td>
                          {user.status === "Approved" ? (
                            <td>{formatDate(user.approval_date)}</td>
                          ) : null}
                          <td>{user.status}</td>
                          {user.status === "Pending" ? (
                            <td>
                              <CustomButton
                                onClick={() =>
                                  handleApproveReject(user.id, "Approved")
                                }
                                name={"Approve"}
                              />
                              <CustomButton
                                onClick={() =>
                                  handleApproveReject(user.id, "Rejected")
                                }
                                name={"Reject"}
                                bgcolor="red"
                              />
                            </td>
                          ) : null}
                        </tr>
                      );
                    }
                  })}
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

export default ManagerChangeRequest;
