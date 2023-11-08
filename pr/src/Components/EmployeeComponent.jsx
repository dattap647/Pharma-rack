import React, { useState } from 'react';
import { Input } from 'reactstrap';
import DatePicker from 'react-multi-date-picker';
import CustomNavbar from './CustomNavbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getRole, getToken } from '../auth/index';
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RouterCard from './RouterCard/RouterCard';
import AllManagerModal from './AllManagerModal';
import CustomButton from './CustomButton';


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
 
// Function to format dates for the API request
const formatDatesForApi = (dates) => {
  if (Array.isArray(dates)) {
    // Handle multiple dates
    return dates.map((date) => {
      if (date instanceof Date) {
        return date.toISOString();
      } else {
        // Handle cases where the date might be in a different format
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          return parsedDate.toISOString();
        } else {
          // Handle invalid date format as needed
          return null;
        }
      }
    });
  } else if (dates instanceof Date) {
    // Handle a single date
    return [dates.toISOString()];
  } else {
    // Handle other cases (e.g., date in a different format)
    const parsedDate = new Date(dates);
    if (!isNaN(parsedDate)) {
      return [parsedDate.toISOString()];
    } else {
      return [];
    }
  }
};
 
function EmployeeComponent() {
  const userRole = getRole();
  const [selectedDates, setSelectedDates] = useState([]);
  const [userEnteredTotalHours, setUserEnteredTotalHours] = useState(0);
  const [modal,setModal]=useState(false)
  const handleSubmit = async () => {
    console.log("slected date ",selectedDates);
    try {
      const formattedDates = formatDatesForApi(selectedDates);
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
        value={selectedDates}
        onChange={setSelectedDates}
        multiple
        // dateSeparator=" to "
        multipleRangeSeparator="&"
        placeholder="Select Dates"
        maxDate={new Date()}
        style={{height:35, }}
      />
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