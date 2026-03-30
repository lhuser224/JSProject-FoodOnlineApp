import axiosClient from '../api/axiosClient';

const BASE_URL = '/FoodO/foods';

const foodService = {
  getFoods: async (params = {}) => {
    const response = await axiosClient.get(`${BASE_URL}/`, { params });
    return response;
  },
  getFoodById: async (foodId) => {
    const response = await axiosClient.get(`${BASE_URL}/${foodId}`);
    return response;
  },
  searchFoods: async (query) => {
    const response = await axiosClient.get(`${BASE_URL}/`, { params: { search: query } });
    return response;
  },
  addFood: async (shopId, foodData) => {
    const formData = new FormData();    
    formData.append('name', foodData.name);
    formData.append('price', parseFloat(foodData.price));
    formData.append('shop_id', parseInt(shopId));
    formData.append('category_id', parseInt(foodData.category_id || 1));
    
    if (foodData.image) {
      formData.append('image', foodData.image);
    }

    const response = await axiosClient.post(`${BASE_URL}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  updateFood: async (foodId, updateData) => {
    const formData = new FormData();
    
    if (updateData.name) formData.append('name', updateData.name);
    if (updateData.price) formData.append('price', parseFloat(updateData.price));
    if (updateData.category_id) formData.append('category_id', parseInt(updateData.category_id));
    
    if (updateData.image) {
      formData.append('image', updateData.image);
    }

    const response = await axiosClient.patch(`${BASE_URL}/${foodId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  toggleFoodStatus: async (foodId) => {
    const response = await axiosClient.patch(`${BASE_URL}/${foodId}/toggle`);
    return response;
  },
  getFoodsByShop: async (shopId) => {
    const response = await axiosClient.get(`${BASE_URL}/shop/${shopId}`);
    return response;
  },
  getFoodsByCategory: async (categoryId) => {
    const response = await axiosClient.get(`${BASE_URL}/category/${categoryId}`);
    return response;
  },
  deleteFood: async (foodId) => {
    const response = await axiosClient.delete(`${BASE_URL}/${foodId}`);
    return response;
  }
};

export default foodService;