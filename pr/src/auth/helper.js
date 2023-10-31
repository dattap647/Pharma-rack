import axios from 'axios';
import { getToken } from './index';

export const BASE_URL = 'http://localhost:3001';

export const myAxios = axios.create({
    baseURL : BASE_URL
});

export const privateAxios=axios.create({
    baseURL:BASE_URL
})

privateAxios.interceptors.request.use(config => {
    const token = getToken()
    console.log("axios token::: ",token);
    if(token){
        config.headers.common.Authorization = `{token}`
        return config;      
    }
},error => Promise.reject(error));