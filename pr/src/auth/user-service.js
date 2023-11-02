import { myAxios, privateAxios } from "./helper";

export const signUp=(user)=>{
    console.log("dat-----",user);
    return myAxios
    .post("/attendance-management/v1/auth/register",user)
    .then((response) => response.data)
}

export const loginUser=(loginDetail)=>{
    return myAxios
    .post("/attendance-management/v1/auth/login",loginDetail)
    .then((response) => response.data)
}

export const getUserDetails =()=>{
    return myAxios
    .get("/attendance-management/v1/user/user-details")
    .then((response) => response.data)
}

//attendance status only --> incomplete
//admin token needs to be passed here
//admin-get all user 
export const getAllUsers=()=>{
    return myAxios
    .get("/attendance-management/v1/admin/users-list")
    .then((response)=>response.data)
}

//get all previous record
export const getAllPreviousTimeCards=()=>{
    return myAxios
    .get("/attendance-management/v1/user/attendance/2022-01-01/2023-10-26")
    .then((response)=>{
       return response.data;
    })
}

//get all managers -->incomplete 
//admin token needs to be passed here
export const getAllManagers=()=>{
    return privateAxios
    .get("/attendance-management/v1/admin/manager-list")
    .then((response)=> {
        return response.data;
    })
}
