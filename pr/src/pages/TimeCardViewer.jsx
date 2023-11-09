import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { getToken } from '../auth/index';
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import CustomNavbar from '../Components/CustomNavbar';
import {  Label } from 'reactstrap';
import CustomButton from '../Components/CustomButton';
import DatePicker from 'react-multi-date-picker';
import { formatDatesForApi } from '../utils/helper';

function TimeCardViewer() {
  const [from_date, setFromDate] = useState(null);
  const [to_date, setToDate] = useState(null);
  const [timeCards, setTimeCards] = useState([]);
  const [showdata,setShowNodata]=useState(false)
  const [loading,setLoading]=useState(false)

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = formatDatesForApi(dateRange);

  const handleDateChange = (date, dateType) => {
    if (dateType === 'from') {
      setFromDate(date);
    } else if (dateType === 'to') {
      setToDate(date);
    }
  };

  const fetchTimeCards = async () => {
    let v=formatDatesForApi(dateRange[0])
 console.log("strat date",startDate);
 console.log("end date",endDate);

    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }

      if (!startDate || !endDate) {
        console.error('Please select both from date and to date');
        return;
      }

      const apiUrl = `http://localhost:3001/attendance-management/v1/user/attendance/${startDate}/${endDate}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
       setLoading(true)
      if (response.data.success) {
        if(response.data.data.length===0){
          setShowNodata(true)
          setTimeCards([])
        }
      else{
        setShowNodata(false)
        setTimeCards(response.data.data);
      }
        
      } else {
        console.error('Failed to fetch time cards');
      }
    } catch (error) {
      console.error('Error fetching time cards:', error);
    }
    setTimeout(() => {
      setLoading(false)
     }, 1000);
  }

  return (
    <MDBContainer fluid className='mx-5'>
    <CustomNavbar />
    <MDBContainer>
<MDBCard className='mt-4'>
<MDBCardBody>
<center className='h4 fw-bold'>Time Card Viewer</center>

<hr className='mx-5'/> 
<Label className='fw-bold fs-6 mx-5'>Select Date</Label>
<div className='mx-5'>
 <DatePicker
 style={{ padding:"15px"}}
 format="DD-MM-YYYY"
 value={dateRange}
 maxDate={new Date()}
 weekPicker
 calendarPosition='right'
 showOtherDays
 dateSeparator=' to '
   onChange={(update) => {
       setDateRange(update);
     }}
 />




</div>

<div className='d-flex' style={{margin:"30px 38px"}}>
<CustomButton onClick={fetchTimeCards}  name={"Fetch Time Cards"} />
<CustomButton bgcolor='white' name={"Back"} color='black' href='/user/employee'/>

          </div>
</MDBCardBody>

</MDBCard>
    
     
      {timeCards.length > 0 &&  (
        <div className='card my-5'>
      
          <h3 className='text-center mt-4'>Time Cards</h3>
          <hr className='mx-5'/>

          <div className="container">
          <div className="row mx-5 mb-4 ">
          <div className="col fs-5 fw-bold ">Date</div>
          <div className="col fs-5 fw-bold ">Status</div>
          <div className="col fs-5 fw-bold ">Total Hours</div>
          </div>
          {timeCards.map((card) => (
            <div key={card.attendance_id} className="row mx-5 mb-1 border-bottom">
              <p className='col'>{new Date(card.date).toLocaleDateString()}</p>
              <p className='col'>{card.status}</p>
              <p className='col'>{card.total_hours}</p>
              
            </div>
          ))}
         
          </div>
        </div>
      )}
      
      {
        showdata?
        ( 
      <p className="text-center my-5" style={{fontSize:20, fontWeight:600 , color:"grey"}}>No Data found</p>
    
      
      ):null}
    
    
    </MDBContainer>
    </MDBContainer>
  );
}

export default TimeCardViewer;