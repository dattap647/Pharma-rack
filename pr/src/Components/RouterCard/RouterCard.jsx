import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit'
import React from 'react'
import { Link } from 'react-router-dom';
import './style.css'


const RouterCard = (props) => {
  return (
    <Link style={{textDecoration:"none"}} to={props.to}>
    <MDBCard className='router-card'>
    <MDBCardBody>
    <h4>{props.headText}</h4>
    <p>{props.subText}</p>
    </MDBCardBody>
    </MDBCard>
    </Link>
    
  )
}

export default RouterCard