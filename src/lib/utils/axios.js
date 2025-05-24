import axios from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL, CLIENT_BASE_URL } from './constants'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? API_BASE_URL
const clientURL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? CLIENT_BASE_URL

const BackendAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
})

// BackendAxios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get("token")}`

export const DefaultAxios = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

export const FormAxios = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
    },
})

// FormAxios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get("token")}`

export const ClientAxios = axios.create({
    clientURL,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'multipart/form-data'
    },
})

export default BackendAxios