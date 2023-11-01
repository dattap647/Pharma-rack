import React, { useState, useEffect } from 'react';
import { getToken } from '../auth/index';
import axios from 'axios';
import { MDBContainer } from 'mdb-react-ui-kit';
import CustomNavbar from '../Components/CustomNavbar';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';

function AllManagers() {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleRequestSubmit = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }

      if (!selectedManager) {
        console.error('Please select a manager');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/attendance-management/v1/user/manager-request',
        { manager_id: selectedManager },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
        console.log("Axios Data from All Managers:  ",response);
      if (response.data.success) {
        setRequestSubmitted(true);
      } else {
        console.error('Failed to submit manager request');
      }
    } catch (error) {
      console.error('Error submitting manager request:', error);
    }
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('No token available');
          return;
        }

        const response = await axios.get('http://localhost:3001/attendance-management/v1/auth/manager-list', {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data.success) {
          setManagers(response.data.data);
        } else {
          console.error('Failed to fetch manager list');
        }
      } catch (error) {
        console.error('Error fetching manager list:', error);
      }
    };

    fetchManagers();
  }, []);

  return (
    <div>
      <CustomNavbar />
      <MDBContainer className='mt-5'>
        <label>Select a Manager:</label>
        &nbsp;&nbsp;&nbsp;
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="">Select a Manager</option>
          {managers.map((manager) => (
            <option key={manager.user_id} value={manager.user_id}>
              {manager.first_name}{manager.last_name}
            </option>
          ))}
        </select>
        <br /><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button color='dark' className='ms-2 dark' outline onClick={handleRequestSubmit}>
          Submit
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button className='ms-2 dark' href="/user/employee" outline>Return to Home</Button>
        {requestSubmitted && (
          toast.success("Manager request submitted for approval.")
        )}
      </MDBContainer>
    </div>
  );
}

export default AllManagers;