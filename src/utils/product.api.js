import axiosInstance from "./axios";

export const getAllProducts = () => axiosInstance.get("/product");

export const getProductById = (id) => axiosInstance.get(`/product/${id}`);

export const createProduct = (product) => axiosInstance.post("/product", product);
export const updateProduct = (id, product) => axiosInstance.put(`/product/${id}`, product);

export const deleteProduct = (id) => axiosInstance.delete(`/product/${id}`);