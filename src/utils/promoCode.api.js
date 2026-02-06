import axiosInstance from "./axios";

export const getAllPromoCodes = () => axiosInstance.get("/promoCode");

export const getPromoCodeById = (id) => axiosInstance.get(`/promoCode/${id}`);

export const createPromoCode = (promoCode) => axiosInstance.post("/promoCode", promoCode);

export const updatePromoCode = (id, promoCode) => axiosInstance.put(`/promoCode/${id}`, promoCode);

export const deletePromoCode = (id) => axiosInstance.delete(`/promoCode/${id}`);
