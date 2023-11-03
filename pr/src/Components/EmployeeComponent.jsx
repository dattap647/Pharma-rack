import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Container } from 'reactstrap';
import DatePicker from 'react-multi-date-picker';
import CustomNavbar from './CustomNavbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getRole, getToken } from '../auth/index';
 
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
 
  return (
    <Container fluid>
      <CustomNavbar />
      <Card className="container mt-4">
        <CardBody>
          <CardTitle tag="h5">Employee Timesheet</CardTitle>
          <div className="form-group">
            <label>Select Dates:</label>
            <DatePicker
              value={selectedDates}
              onChange={setSelectedDates}
              multiple
              // dateSeparator=" to "
              multipleRangeSeparator="&"
              placeholder="Select Dates"
              maxDate={new Date()}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Total Hours:</label>
            <input
              type="number"
              step="0.01"
              name="logged_hours"
              value={userEnteredTotalHours}
              onChange={(e) => setUserEnteredTotalHours(parseFloat(e.target.value) || 0)}
              className="form-control"
              placeholder="Total Hours"
            />
          </div>
          <br />
          <Button onClick={handleSubmit} color="primary" className="rounded-pill" outline>
            Submit
          </Button>
          &nbsp;&nbsp;
          <Button color='dark' className='ms-2 dark' href="/user/previousTimeCards" outline> Previous TimeCard </Button>
          &nbsp;&nbsp;
          <Button className='ms-2 dark' color='dark' href="/user/managers" outline>Change Manager</Button>
          &nbsp;&nbsp;
          {
userRole===2?<Button className='ms-2 dark' color='dark' href="/user/managerDashboard" outline>Approve Manager Request</Button>:null
          }
          &nbsp;&nbsp;{userRole===2?<Button className='ms-2 dark' color='dark' href="/user/allEmployee" outline>Manage Employees</Button>:null}
          {/* <br /> */}
          {userRole===2?<Button className='ms-2 dark' color='dark' href="/user/attendance" outline>Approve Attendance</Button>:null}
        </CardBody>
      </Card>
    </Container>
  );
}
 
export default EmployeeComponent;