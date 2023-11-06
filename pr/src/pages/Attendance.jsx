import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../auth/index";
import { Table,Button, Container, Label } from "reactstrap";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from "../Components/CustomNavbar";
import { formatDate } from "../utils/helper";


const Attendance = () => {
  const [status, setStatus] = useState("Select Status"); 
  const [response, setResponse] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers(); 
  }, [status]);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      const response = await axios.get(
        `http://localhost:3001/attendance-management/v1/manager/attendance/${status}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleApproveReject = async (attendanceId, newStatus) => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      const response = await axios.put(
        "http://localhost:3001/attendance-management/v1/manager/attendance",
        {
          attendance_ids: [attendanceId],
          status: newStatus,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setResponse(response.data.data[0]);
      fetchUsers(); // After updating, re-fetch users
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error: Attendance request could not be approved.");
    }
  };

  return (
    <div>
        <CustomNavbar />
        <Container>
        <h2 className="mt-5 d-flex justify-content-center">Attendance Approval</h2>
      <Label>
        Status: 
        &nbsp;&nbsp;
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Select Status">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>

        </select>
      </Label>
      <br />

      {users.length > 0 && (
        <Table striped>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Date</th>
              <th>Status</th>
            { status==="Pending"? <th>Actions</th>:null}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.attendance_id}>
                <td>{user.user_id}</td>
                <td>{formatDate(user.date)}</td>
                <td>{user.status}</td>
                <td>
                  {status === "Pending" && (
                    <>
                      <Button onClick={() => handleApproveReject(user.attendance_id, "Approved")} outline>Approve</Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button onClick={() => handleApproveReject(user.attendance_id, "Rejected")} outline>Reject</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {response && 
      <p>
        {response}
      </p>}
      <br />
      <Button className='ms-2 dark' href="/user/employee" outline>Return to Home</Button>
        </Container>
    </div>
  );
};

export default Attendance;