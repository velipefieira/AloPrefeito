import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.5.183:5000"
});

export default api;