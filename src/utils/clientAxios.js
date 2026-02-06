import axios from "axios";

// Axios instance for client creation (without credentials)
const clientAxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  // NO withCredentials for client creation endpoint
});

export default clientAxiosInstance;
