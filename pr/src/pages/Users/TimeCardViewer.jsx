import React, { useState } from "react";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import CustomNavbar from "../../Components/CustomNavbar";
import { Label } from "reactstrap";
import CustomButton from "../../Components/common/CustomButton";
import DatePicker from "react-multi-date-picker";
import { formatDatesForApi } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { getAllPreviousTimeCards } from "../../auth/user-service";
import { toast } from "react-toastify";

function TimeCardViewer() {
  const navigate = useNavigate();
  const [timeCards, setTimeCards] = useState([]);
  const [showdata, setShowNodata] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = formatDatesForApi(dateRange);
  const fetchTimeCards = () => {
    console.log(startDate);
    if (!startDate || !endDate) {
      toast.error("Please select both from date and to date");
      return;
    }

    getAllPreviousTimeCards(startDate, endDate)
      .then((response) => {
        if (response.data.length === 0) {
          setShowNodata(true);
          setTimeCards([]);
        } else {
          setShowNodata(false);
          setTimeCards(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error.split("CustomError:")[1]);
      });
  };

  return (
    <MDBContainer fluid className="mx-5">
      <CustomNavbar />
      <MDBContainer>
        <MDBCard className="mt-4">
          <MDBCardBody>
            <center className="h4 fw-bold">Time Card Viewer</center>

            <hr className="mx-5" />
            <Label className="fw-bold fs-6 mx-5">Select Date</Label>
            <div className="mx-5">
              <DatePicker
                style={{ padding: "15px" }}
                format="DD-MM-YYYY"
                value={dateRange}
                maxDate={new Date()}
                weekPicker
                calendarPosition="right"
                showOtherDays
                dateSeparator=" to "
                onChange={(update) => {
                  setDateRange(update);
                }}
              />
            </div>

            <div className="d-flex" style={{ margin: "30px 38px" }}>
              <CustomButton
                onClick={fetchTimeCards}
                name={"Fetch Time Cards"}
              />
              <CustomButton
                bgcolor="white"
                name={"Back"}
                color="black"
                onClick={() => navigate(-1)}
              />
            </div>
          </MDBCardBody>
        </MDBCard>

        {timeCards.length > 0 && (
          <div className="card my-5">
            <h3 className="text-center mt-4">Time Cards</h3>
            <hr className="mx-5" />

            <div className="container">
              <div className="row mx-5 mb-4 ">
                <div className="col fs-5 fw-bold ">Date</div>
                <div className="col fs-5 fw-bold ">Status</div>
                <div className="col fs-5 fw-bold ">Total Hours</div>
              </div>
              {timeCards.map((card) => (
                <div
                  key={card.attendance_id}
                  className="row mx-5 mb-1 border-bottom"
                >
                  <p className="col">
                    {new Date(card.date).toLocaleDateString()}
                  </p>
                  <p className="col">{card.status}</p>
                  <p className="col">{card.total_hours}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showdata ? (
          <p
            className="text-center my-5"
            style={{ fontSize: 20, fontWeight: 600, color: "grey" }}
          >
            No Data found
          </p>
        ) : null}
      </MDBContainer>
    </MDBContainer>
  );
}

export default TimeCardViewer;
