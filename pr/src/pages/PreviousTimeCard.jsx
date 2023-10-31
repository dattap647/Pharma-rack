import React, { useEffect } from 'react'
import { MDBContainer } from 'mdb-react-ui-kit'
import CustomNavbar from '../Components/CustomNavbar'
import { getAllPreviousTimeCards } from '../auth/user-service'

const PreviousTimeCard=()=>{
    useEffect(()=>{
        getAllPreviousTimeCards().then((data)=>{
            console.log(data);
        }).catch(error=>{
            console.log(error)
        })
    },[])
    
  return (
   <div>
    <CustomNavbar />
     <MDBContainer>
        
        </MDBContainer>
   </div>
  )
}

export default PreviousTimeCard
