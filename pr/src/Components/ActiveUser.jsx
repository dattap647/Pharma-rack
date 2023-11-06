

import axios from 'axios';
import React, { useState ,useEffect} from 'react'
import { getToken } from '../auth';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

const ActiveUser = ({user,key,handleUpdate}) => {

const [data,setData]=useState({
    userId:user.user_id,
    status:user.status
})
const [edit,setEdit]=useState(false)
    const status=[
        {
            id:1,
            status:"active"
        },
        {
            id:2,
            status:"blocked"
        }
    ];

    const apiUrl="http://localhost:3001/attendance-management/v1/manager/user"
    const updateUserStatus = async () => {

        try {
            const token = getToken();
            console.log("token",token);
            if (!token) {
              console.error('No token available');
              return;
            }
        const response = await axios.put(`${apiUrl}/${data.userId}/${data.status}`,{} , {
            headers: {
              Authorization: `${token}`,
            },
          });
        console.log("Console Response... ", response);
        if (response.data.success) {
            console.log(response.data.data);
            setEdit(!edit)
            toast.success("Status updated Successfully")
            handleUpdate();
           
        } else {
          console.error('Failed to update the status');
        }
      } catch (error) {
        toast.error("something went wrong")
        console.error('Error updating user data:', error);
      }
    };


const submitStatus=()=>{
    updateUserStatus();
    

}

const handleChange=(e)=>{
setData({
    ...data,
 status:e.target.value,
})

}

useEffect(() => {
    toast.success(data)
}, [data])


  return (
    <tr key={key}>
        <td>
          {user.first_name}
        </td>
        <td>
        {user.email}
        </td>
        <td>
        { edit?
            
            <select
            value={data.status}
             onChange={(e) => handleChange(e)}
        
          >
            
          <option value="">Select Option</option>
          {status.map((s,i) => (
            <option key={s.id} value={s.status} >
              {s.status}
            </option>
          ))}



          </select>
            
            
            :user.status}
        </td>
        <td>
    {edit? <div className='d-flex gap-1'>
    <Button className='dark' onClick={submitStatus} color='success'  outline >Save</Button>

        <Button  className="dark" onClick={()=>setEdit(!edit)} color='danger' outline>Cancel</Button>
        </div>
        :<Button className="dark" onClick={()=>setEdit(!edit)}>Edit</Button>}
        </td>
      </tr>
  )
}



export default ActiveUser
