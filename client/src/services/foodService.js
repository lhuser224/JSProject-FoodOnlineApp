import axiosClient from '../api/axiosClient';

export const getFoods = async (shopId) => {
  try {
    const url = shopId ? `/seller/${shopId}/foods` : '/foods';
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const getFoodById = async (foodId) => {
  try {
    return await axiosClient.get(`/foods/${foodId}`);
  } catch (error) {
    throw error;
  }
};

export const searchFoods = async (query) => {
  try {
    return await axiosClient.get('/foods/search', { params: { q: query } });
  } catch (error) {
    throw error;
  }
};

export const addFood = async (shopId, foodData) => {
  try {
    const payload = {
      name: foodData.name,
      price: parseFloat(foodData.price),
      image_url: foodData.image_url || '',
      category_id: foodData.category_id || 1
    };
    return await axiosClient.post(`/seller/${shopId}/add-food`, payload);
  } catch (error) {
    throw error;
  }
};

export const updateFood = async (shopId, foodId, foodData) => {
  try {
    return await axiosClient.patch(`/seller/${shopId}/foods/${foodId}`, foodData);
  } catch (error) {
    throw error;
  }
};

export const toggleFoodStatus = async (shopId, foodId) => {
  try {
    return await axiosClient.patch(`/foods/${foodId}/status`);
  } catch (error) {
    throw error;
  }
};

export const getFoodsByShop = async (shopId) => {
  try {
    return await axiosClient.get(`/foods/shop/${shopId}`);
  } catch (error) {
    throw error;
  }
};

export const getFoodsByCategory = async (categoryId) => {
  try {
    return await axiosClient.get(`/foods/category/${categoryId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteFood = async (shopId, foodId) => {
  try {
    return await axiosClient.delete(`/seller/${shopId}/foods/${foodId}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getFoods,
  getFoodById,
  searchFoods,
  addFood,
  updateFood,
  toggleFoodStatus,
  getFoodsByShop,
  getFoodsByCategory,
  deleteFood
};