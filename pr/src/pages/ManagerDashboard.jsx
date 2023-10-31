import React, { useState } from 'react';
import axios from 'axios';
import { getRole, getToken } from '../auth/index';
import CustomNavbar from '../Components/CustomNavbar';
import { toast } from 'react-toastify';
import { Button, Input, Label } from 'reactstrap';
import { MDBContainer } from 'mdb-react-ui-kit';

function ManagerDashboard() {
  //importing fn to get role from console
  const userRole = getRole();
  const [id, setRequestId] = useState('');
  const [status, setStatus] = useState('Approved');
  const [responseMessage, setResponseMessage] = useState('');

  if(userRole !== 2){
    return (
      <div>
        <CustomNavbar />
       <MDBContainer className='mt-5'>
       <h2>
          Access Denied!!!!!
        </h2>
        <p>You do not have permission to access this Page </p>
        <br />
        <Button className='ms-2 dark' href="/user/employee" outline>Return to Home</Button>
       </MDBContainer>
      </div>
    );
  }

  const handleRequestUpdate = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }

      if (!id) {
        console.error('Please enter a request ID');
        toast.error("Please enter a request ID")
        return;
      }

      const apiUrl = `http://localhost:3001/attendance-management/v1/manager/update-manager_requests/${id}/${status}`;
      const response = await axios.put(apiUrl, null, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log("Axios Request From User: ",response)

      if (response.data.success) {
        setResponseMessage(`Manager request with ID ${id} ${status}.`);
      } else {
        console.error('Failed to update manager request');
      }
    } catch (error) {
      console.error('Error updating manager request:', error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className='mt-4'>
      <h3>Manager Dashboard</h3>
      </div>
      <Label>Request ID:</Label>
      <Input
        type="text"
        value={id}
        onChange={(e) => setRequestId(e.target.value)}
      />
      <br />
      <Label>Status:</Label> &nbsp; &nbsp;
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <br />
      &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
      <Button onClick={handleRequestUpdate} className='dark mt-4' outline>Update Request</Button>
      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
}

export default ManagerDashboard;