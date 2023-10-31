import { privateAxios } from "./helper";

export const createAttendance=(postAttendance)=>{
    console.log("Receieved Data from axios: ",postAttendance);
    return privateAxios
    .post(`/attendance-management/v1/user/attendance`,postAttendance)
    .then((response)=>{
        return response.data;
    })
}

