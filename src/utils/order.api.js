import axiosInstance from "./axios";

export const getAllOrders = () => axiosInstance.get("/orders");

export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);

export const createOrder = (order) => axiosInstance.post("/orders", order);

export const updateOrder = (id, order) => axiosInstance.put(`/orders/${id}`, order);

export const deleteOrder = (id) => axiosInstance.delete(`/orders/${id}`);

export const completePayment = (orderId, payment) =>
	axiosInstance.post(`/orders/completePayment/${orderId}`, payment);
