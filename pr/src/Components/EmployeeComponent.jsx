import React, { useState } from 'react';
import { Input } from 'reactstrap';
import DatePicker ,{ DateObject, getAllDatesInRange }from 'react-multi-date-picker';
import CustomNavbar from './CustomNavbar';
import { Icons, toast } from 'react-toastify';
import axios from 'axios';
import { getRole, getToken } from '../auth/index';
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RouterCard from './RouterCard/RouterCard';
import AllManagerModal from './AllManagerModal';
import CustomButton from './CustomButton';
import { formatDatesForApi } from '../utils/helper';
import { getDay } from 'date-fns';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
});
 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("Here is the token: "+token);
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
function EmployeeComponent() {
  const userRole = getRole();      
const [dates, setDates] = useState([])
const [allDates, setAllDates] = useState([])
  const [userEnteredTotalHours, setUserEnteredTotalHours] = useState(0);
  const [modal,setModal]=useState(false)
  const handleSubmit = async () => {
  
    try {
      const formattedDates = formatDatesForApi(allDates);
      console.log("Selected Dates:::: ",formattedDates);
      if (formattedDates.length === 0) {
        toast.error('Please select at least one date.');
        return;
      }
     
 
      const requestData = {
        dates: formattedDates,
        logged_hours: userEnteredTotalHours,
      };
 
      try {
        await axiosInstance.post('/attendance-management/v1/user/attendance', requestData);
        toast.success('Data submitted successfully.');
        setDates([]);
    setAllDates([]);
      } catch (error) {
        toast.error(`Error submitting data: ${error.message}`);
        // toast.error("Error submitting data: Please Raise a Request For Manager!");
      }
    } catch (error) {
      toast.error('Error Formatting dates. Please select valid dates');
    }
  }
 const handleModal=()=>{
  setModal(!modal)
 }
 const isWeekday=(date)=>{
  const day=getDay(date);
  return day!==0 && day !==6

}
  return (
    <MDBContainer fluid className='mx-5'>
      <CustomNavbar />
      <MDBContainer>
      <MDBCard className='mt-4'>
      <MDBCardBody>
      <h2 className='text-center '>Employee Timesheet</h2>
      <hr className='mx-5'/>
      <MDBRow className='mx-5'>
      <MDBCol col="6">
      <div className="form-group d-flex flex-column">
      <label className='fw-bold fs-6'>Select Dates</label>
      <DatePicker
      style={{ height:"38px"}}
      range
      rangeHover
  
      value={dates}
      maxDate={new DateObject()}
      onChange={dateObjects => {
        setDates(dateObjects)
        setAllDates(getAllDatesInRange(dateObjects))
      }}
    />
    </div>



<div>


</div>
  </MDBCol>
    
  <MDBCol>
  <div className="form-group">
  <label className='fw-bold fs-6'>Total Hours</label>
  <Input
    type="number"
    step="0.01"
    name="logged_hours"
    value={userEnteredTotalHours}
    onChange={(e) => setUserEnteredTotalHours(parseFloat(e.target.value) || 0)}
    className="form-control"
    placeholder="Total Hours"
  />
</div>
</MDBCol>

      </MDBRow>

      {dates.length > 1 &&
        <div className="d-flex flex-wrap mx-5 mt-3">
          
          {allDates.map((date,index)=>{
            return <div className="card m-2 p-2" style={{background:"#f1f2f2"}}> {date.format("DD-MM-YYYY")}</div>
          }
          )}
        </div>
      }

      <div className='d-flex justify-content-end  ' style={{margin:"15px 58px"}}>
      <CustomButton onClick={handleSubmit} bgcolor={"#687EFF"} name={"Submit"}/>
      </div>
      <hr className='mx-5 my-5'/>
      </MDBCardBody>
      
      </MDBCard>

      <div className=" mt-5 d-flex gap-4 flex-wrap justify-content-start">

<RouterCard to="/user/previousTimeCards" headText=" Previous Time Card" subText="Open your Time Card" />

<div className="" onClick={handleModal} >
<RouterCard  headText="Change Manager" subText="Request to Change Manager" />
</div>


{
  userRole===2?<>
  <RouterCard  to="/user/managerDashboard"  headText="Approve Manager Request" subText="Change Manager Request from Employee">
  
  </RouterCard>
<RouterCard  to="/user/allEmployee" headText="Manage Employees" subText=" Manage New Employee Request"/>

<RouterCard  to="/user/attendance" headText="Approve Attendance" subText="Attendance Request from Employee"/>
  </>:null
}
      </div>
      </MDBContainer>
      <AllManagerModal modal={modal} toggle={handleModal}/>
    </MDBContainer>
  );
}
 
export default EmployeeComponent;