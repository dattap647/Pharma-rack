import React from 'react'
import { Button } from 'reactstrap'

const CustomButton = ({onClick,bgcolor="#687EFF",name,color="white",href=""}) => {
  return (
    <Button onClick={onClick} style={{background:bgcolor, color:color, fontSize:"15px" , fontWeight:"bold"}} className="rounded ms-2" variants href={href} >{name}</Button>
  )
}

export default CustomButton