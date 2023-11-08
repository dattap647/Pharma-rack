
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { getToken } from '../auth';
import axios from 'axios';
import CustomButton from './CustomButton';

function AllManagerModal(props) {
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
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
        props.toggle()
        toast.success("Manager request submitted for approval.")
        } 
      } catch (error) {
        props.toggle()
        toast.error(error.response.data.error.split('CustomError:')[1]);
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
    <div><Modal isOpen={props.modal} toggle={props.toggle}  size='lg' backdrop="static">
    <ModalHeader toggle={props.toggle}>Change Manager Request</ModalHeader>
    <ModalBody>
    {/*<Container className='mt-5'>*/}
    <Label className='fw-bold fs-6 ml-1'>Select  Manager</Label>
  
    <Input type='select'
      value={selectedManager}
      onChange={(e) => setSelectedManager(e.target.value)}
    >
      <option value="">Select Manager</option>
      {managers.map((manager) => (
        <option key={manager.user_id} value={manager.user_id}>
          {manager.first_name} {manager.last_name}
        </option>
      ))}
    </Input>
    
    </ModalBody>
    <ModalFooter>
    <CustomButton onClick={handleRequestSubmit}  name={"Submit"}/>
    <CustomButton onClick={props.toggle} bgcolor={"red"} name={"Cancel"}/>
      
    </ModalFooter>
  </Modal>

  </div>
  )
}

export default AllManagerModal