import axios from "axios";

const api = axios.create({
    baseURL: process.env.URL_BASE || "http://192.168.15.27:5000"
});

export default api;