import axios from "axios";
import { getToken } from "../auth";

const apiUrl = `http://localhost:3001/attendance-management/v1/manager/users-list`;

export const fetchUserList = async () => {

    try {
        const token = getToken();
        if (!token) {
          console.error('No token available');
          return;
        }
    const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });
    console.log("Console Response... ", response);
    if (response.data.success) {
        console.log(response.data.data);
        return response.data.data
      //setUserList(response.data.data);
    } else {
      console.error('Failed to fetch manager list');
    }
  } catch (error) {
    console.error('Error fetching manager list:', error);
  }
};