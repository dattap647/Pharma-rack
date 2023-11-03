import React, { useEffect, useState } from 'react'
import { getToken } from '../auth';
import axios from 'axios';
import CustomNavbar from '../Components/CustomNavbar';
import { Button, Container, Label, Table } from 'reactstrap';
import { formatDate } from '../utils/helper';
import { toast } from 'react-toastify';

const ManagerChangeRequest = () => {
    const [status, setStatus] = useState("Pending"); 
    const [response, setResponse] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
      fetchUsers(); 
    }, [status]);
  
    const apiUrl="http://localhost:3001/attendance-management/v1/manager/update-manager_requests";
    const fetchUsers = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('No token available');
          return;
        }
        const response = await axios.get(
          `http://localhost:3001/attendance-management/v1/manager/manager_requests`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setUsers(response.data.data);
        fetchUsers();
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    const handleApproveReject = async (userId,status) => {
      try {
        const token = getToken();
        if (!token) {
          console.error('No token available');
          return;
        }
        const response = await axios.put(
          `${apiUrl}/${userId}/${status}`
          ,{},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.data.success) {
            console.log(response.data.data);
          toast.success(response)
          setResponse(response.data.data);
          fetchUsers(); 
        } 
      // After updating, re-fetch users
      } catch (error) {
        console.error("Error:", error);
        setResponse("Error: Attendance request could not be approved.");
      }
    };
  
    return (
      <div>
          <CustomNavbar />
          <Container>
          <h2 className="mt-5 d-flex justify-content-center">Manager Change Request</h2>
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
                <th>Request Date</th>
                {status==="Approved"?<th>Approval date</th>:null}
                <th>Status</th>
               {status==="Pending" ?<th>Actions</th>:null} 
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                if(user.status===status){
                    return <tr key={user.id}>
                    <td>{user.user_id}</td>
                    <td>{formatDate(user.request_date)}</td>
                    {user.status==="Approved"? <td>{formatDate(user.approval_date)}</td>:null}
                    <td>{user.status}</td>
                    {user.status==="Pending"?
                    <td>
                    <Button onClick={() => handleApproveReject(user.id, "Approved")} outline>Approve</Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button onClick={() => handleApproveReject(user.id, "Rejected")} outline>Reject</Button>
                      </td>
                      :null 
                   }
                  
                  </tr>

                }
            

              }
                
             
              )
            
            }

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
}

export default ManagerChangeRequest