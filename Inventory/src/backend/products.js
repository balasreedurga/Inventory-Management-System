import { fetchData, addData, updateData } from "./firebaseUtils";

const PRODUCTS_COLLECTION = "products";

// Fetch all products
export const getProducts = async () => {
  return await fetchData(PRODUCTS_COLLECTION);
};

// Add a new product
export const addProduct = async (productData) => {
  return await addData(PRODUCTS_COLLECTION, productData);
};

// Update an existing product
export const updateProduct = async (productId, updatedData) => {
  return await updateData(PRODUCTS_COLLECTION, productId, updatedData);
};
