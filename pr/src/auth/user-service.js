import { getRole, getToken } from ".";
import {
  UpdateUserAttendanceForAdminUrl,
  UpdatechangeManagerRequestUrlForAdmin,
  UpdatechangeManagerRequestUrlForManager,
  changeManagerRequestUrlForAdmin,
  changeManagerRequestUrlForManager,
  changeManagerUrlForManager,
  chnageRoleByAdminUrl,
  getAllManagersUrl,
  getAllUserAttendanceForAdminUrl,
  getUserAttendanceForManagerUrl,
  getattendanceUrl,
  loginUrl,
  signupUrl,
  submitAttendanceUrl,
  userDetailUrl,
  userStatusbyAdminUrl,
  userStatusbyManagerUrl,
} from "./constants";
import { myAxios, privateAxios } from "./helper";

export const signUp = (user) => {
  return myAxios.post(signupUrl, user).then((response) => response.data);
};

export const loginUser = (loginDetail) => {
  return myAxios.post(loginUrl, loginDetail).then((response) => response.data);
};

export const getUserDetails = () => {
  return myAxios.get(userDetailUrl).then((response) => response.data);
};

//attendance status only --> incomplete
//admin token needs to be passed here
//admin-get all user
export const getAllUsers = (apiUrl) => {
  const token = getToken();
  return myAxios
    .get(apiUrl, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => response.data);
};

export const submitAttendance = (requestData) => {
  const token = getToken();
  return myAxios
    .post(submitAttendanceUrl, requestData, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => response.data);
};

//get all previous record
export const getAllPreviousTimeCards = (from,to) => {
  const token=getToken();
  return myAxios
    .get(`${getattendanceUrl}/${from}/${to}`,{
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => response.data);
};

//get all managers -->incomplete
//admin token needs to be passed here
export const getAllManagers = () => {
  return myAxios.get(getAllManagersUrl).then((response) => response.data);
};

export const fetchUserAttendance = (status) => {
  const token = getToken();
  const role =getRole();
  const apiUrl = role === 1 ? getAllUserAttendanceForAdminUrl : `${getUserAttendanceForManagerUrl}/${status}`;
  return myAxios
    .get(apiUrl, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => response.data);
};

export const HandleAttendanceStatus = (attendanceId,newStatus) => {
  const token = getToken();
  const role =getRole();
  const apiUrl = role === 1 ? UpdateUserAttendanceForAdminUrl : getUserAttendanceForManagerUrl;
  return myAxios
    .put(
      apiUrl,
      {
        attendance_ids: [attendanceId],
        status: newStatus,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => response.data);
};

export const UserStatus = (userId, status) => {
  const token = getToken();
  const role =getRole();
  const apiUrl = role === 1 ? userStatusbyAdminUrl : userStatusbyManagerUrl;
  return myAxios.put(
    `${apiUrl}/${userId}/${status}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  ).then((response) => response.data);
};

export const UserRole = (requestData) => {
  const token = getToken();
  return myAxios.post(chnageRoleByAdminUrl, requestData, {
    headers: {
      Authorization: `${token}`,
    },
  }).then((response) => response.data);
};


export const fetchManagerRequest=()=>{
  const token = getToken();
  const role=getRole();
  const apiUrl = role === 1 ? changeManagerRequestUrlForAdmin: changeManagerRequestUrlForManager;
  return myAxios.get(
    apiUrl,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  ).then(response=>response.data);
}

export const UpdateManagerRequestsStatus = (userId, status) => {
  const token = getToken();
  const role =getRole();
  const apiUrl = role === 1 ? UpdatechangeManagerRequestUrlForAdmin : UpdatechangeManagerRequestUrlForManager;
  return myAxios.put(
    `${apiUrl}/${userId}/${status}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  ).then((response) => response.data);
};