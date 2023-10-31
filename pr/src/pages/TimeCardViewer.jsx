import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { getToken } from '../auth/index';
import { MDBContainer } from 'mdb-react-ui-kit';
import CustomNavbar from '../Components/CustomNavbar';
import { Button, Label } from 'reactstrap';

function TimeCardViewer() {
  const [from_date, setFromDate] = useState(null);
  const [to_date, setToDate] = useState(null);
  const [timeCards, setTimeCards] = useState([]);

  const handleDateChange = (date, dateType) => {
    if (dateType === 'from') {
      setFromDate(date);
    } else if (dateType === 'to') {
      setToDate(date);
    }
  };

  const fetchTimeCards = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token available');
        return;
      }

      if (!from_date || !to_date) {
        console.error('Please select both from date and to date');
        return;
      }

      const apiUrl = `http://localhost:3001/attendance-management/v1/user/attendance/${from_date}/${to_date}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.data.success) {
        setTimeCards(response.data.data);
      } else {
        console.error('Failed to fetch time cards');
      }
    } catch (error) {
      console.error('Error fetching time cards:', error);
    }
  }

  return (
    <div>
    <CustomNavbar />
    <MDBContainer>

      <div className='mt-2'>
      <h1>Time Card Viewer</h1>
      </div>
      <div className='mt-4'>
        <Label>From Date:</Label>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <DatePicker
          selected={from_date}
          onChange={(date) => handleDateChange(date, 'from')}
        />
      </div>
      <div>
        <Label>To Date:</Label>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <DatePicker
          selected={to_date}
          onChange={(date) => handleDateChange(date, 'to')}
        />
      </div>
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <Button onClick={fetchTimeCards} className='dark' outline>Fetch Time Cards</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button className='ms-2 dark' href="/user/employee" outline>Return to Home</Button>
      
      {timeCards.length > 0 && (
        <div>
          <h2>Time Cards</h2>
          {timeCards.map((card) => (
            <div key={card.attendance_id} className="card">
              <h3>Date: {new Date(card.date).toLocaleDateString()}</h3>
              <p>Status: {card.status}</p>
              <p>Total Hours: {card.total_hours}</p>
            </div>
          ))}
        </div>
      )}
    </MDBContainer>
    </div>
  );
}

export default TimeCardViewer;