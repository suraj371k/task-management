import axios from 'axios'

export const backendUrl = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
})