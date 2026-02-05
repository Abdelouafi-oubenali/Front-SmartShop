import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true // 🔥 مهم جداً - for HttpSession cookies
});

export default axiosInstance;
