import axiosInstance from "./axios";

export const getAllUsers = () => axiosInstance.get("/clients");

export const getUserById = (id) => axiosInstance.get(`/clients/${id}`);

export const createUser = (user) => axiosInstance.post("/clients", user);

export const updateUser = (id, user) => axiosInstance.put(`/clients/${id}`, user);

export const deleteUser = (id) => axiosInstance.delete(`/clients/${id}`);