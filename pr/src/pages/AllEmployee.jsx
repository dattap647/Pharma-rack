import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, Col, Container, Row, Table } from 'reactstrap'

import CustomNavbar from '../Components/CustomNavbar'
import axios from 'axios'
import { getToken } from '../auth'
import { MDBIcon } from 'mdb-react-ui-kit'
import ActiveUser from '../Components/ActiveUser'

const AllEmployee = () => {
const [userlist,setUserList]=useState([])
const [isUpdate,setisUpdate]=useState(false)


const apiUrl = `http://localhost:3001/attendance-management/v1/manager/users-list`;

const fetchUserList = async () => {

    try {
        const token = getToken();
        if (!token) {
          console.error('No token available');
          return;
        }
    const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
    console.log("Console Response... ", response);
    if (response.data.success) {
        console.log(response.data.data);
      setUserList(response.data.data);
    } else {
      console.error('Failed to fetch manager list');
    }
  } catch (error) {
    console.error('Error fetching manager list:', error);
  }
};

useEffect(()=>{
fetchUserList()
},[isUpdate])


const handleUpdate=()=>{
    setisUpdate(!isUpdate)

}
  return (
    <Container fluid>
    <CustomNavbar/>
    <Card>
    <CardBody>
    <CardTitle className='d-flex justify-content-center'>
    All Employee
    </CardTitle>
    
    <Table size="sm">
  <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Email
      </th>
      <th>
        Status
      </th>
      <th>
        Action
      </th>
    
    </tr>
  </thead>
  <tbody>
{
    userlist.map((user)=>{
       return <ActiveUser user={user} key={user.user_id} handleUpdate={handleUpdate}/>

    })
}
   
  </tbody>
</Table>
    </CardBody>
    </Card>
    
    </Container>
  )
}

export default AllEmployee