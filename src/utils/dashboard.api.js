import axiosInstance from "./axios";

export const getDashboardStats = () => axiosInstance.get("/dashboard");
