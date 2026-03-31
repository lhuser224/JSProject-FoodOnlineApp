import axiosClient from '../api/axiosClient';

const BASE_URL = 'FoodO/categories'; 

const categoryService = {
  getAllCategories: async (params = {}) => {
    const response = await axiosClient.get(`${BASE_URL}/`, { params }); 
    return response; 
  }
};

export default categoryService;