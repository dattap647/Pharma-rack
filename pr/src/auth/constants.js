import axios from "axios";

export const BASE_URL = 'http://localhost:3001';

export const myAxios = axios.create({
    baseURL : BASE_URL
});

export const loginUrl="/attendance-management/v1/auth/login";
export const signupUrl="/attendance-management/v1/auth/register";

export const userDetailUrl="/attendance-management/v1/user/user-details";
export const getAllManagersUrl="/attendance-management/v1/auth/manager-list";
export const getattendanceUrl="/attendance-management/v1/user/attendance";
export const submitAttendanceUrl="/attendance-management/v1/user/attendance";
export const getUserAttendanceForManagerUrl="/attendance-management/v1/manager/attendance"
export const UpdateUserAttendanceForAdminUrl ="/attendance-management/v1/admin/attendance"
export const getAllUserAttendanceForAdminUrl="/attendance-management/v1/admin/all-attendance"

export const getuserlistForManagerUrl="/attendance-management/v1/manager/users-list"
export const userStatusbyManagerUrl="/attendance-management/v1/manager/user"
export const userStatusbyAdminUrl="/attendance-management/v1/admin/user"

export const chnageRoleByAdminUrl="/attendance-management/v1/admin/change-user-role"
export const changeManagerRequestUrlForManager="/attendance-management/v1/manager/manager_requests"
export const changeManagerRequestUrlForAdmin="/attendance-management/v1/admin/manager_requests" 


export const UpdatechangeManagerRequestUrlForManager="/attendance-management/v1/manager/update-manager_requests"
export const UpdatechangeManagerRequestUrlForAdmin="/attendance-management/v1/admin/update-manager_requests" 