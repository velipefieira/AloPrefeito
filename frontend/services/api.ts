import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.33.15:5000"
});

export default api;
// http://192.168.187.15