import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../auth/index";
import { Table,Button, Container, Label, Input } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from "../Components/CustomNavbar";
import { formatDate } from "../utils/helper";
import CustomButton from "../Components/CustomButton";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import FilterStatus from "../Components/FilterStatus";
import { toast } from "react-toastify";


const Attendance = () => {
  const [status, setStatus] = useState("Pending"); 
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
      if(response.data.success){
        console.log(response);
        newStatus==="Rejected"? toast.error(response.data.data[0]):
        toast.success(response.data.data[0])
        setResponse(response.data.data[0]);
        fetchUsers(); 
      }
     //After updating, re-fetch users
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.error.split('CustomError:')[1]);
      setResponse("Error: Attendance request could not be approved.");
    }
  };

  return (
    <div>
        <CustomNavbar />
        <Container>
        <h2 className="mt-5 d-flex justify-content-center">Attendance Approval</h2>
        <FilterStatus  status={status} setStatus={setStatus}/>
     <MDBCard className="mb-4">
     <MDBCardBody>
     {users.length > 0? (
      <Table borderless>
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
              
                {status === "Pending" && (
                  <td>
                    <Button onClick={() => handleApproveReject(user.attendance_id, "Approved")} outline>Approve</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={() => handleApproveReject(user.attendance_id, "Rejected")} outline>Reject</Button>
                  </td>
                )}
            </tr>
          ))}
        </tbody>
      </Table>
    ): <p className='text-center my-4 fs-5 fw-bold'>No {status} Request</p>
  }
     </MDBCardBody>
     </MDBCard>
   </Container>
    </div>
  );
};

export default Attendance;