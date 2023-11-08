import React from 'react'
import { Input, Label } from 'reactstrap'
import CustomButton from './CustomButton'

const FilterStatus = ({status,setStatus}) => {
  return (
    <div className="d-flex justify-content-between my-5">

    <div className="d-flex gap-2  justify-content-between align-items-baseline ">
    <Label className='fw-bold '>
    Status:</Label>
    <Input type='select' value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="Select Status">Select Status</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </Input>
    </div>
    <CustomButton color='black' bgcolor='white' name={"Back"} href="/user/employee" />
    </div>
  )
}

export default FilterStatus