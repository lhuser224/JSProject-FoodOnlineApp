import axiosClient from '../api/axiosClient';

const BASE_URL = '/FoodO/options'; 

const optionService = {
  getGroupsByShop: async (shopId) => {
    const response = await axiosClient.get(`${BASE_URL}/shop/${shopId}`);
    return response;
  },

  createGroup: async (groupData) => {
    const response = await axiosClient.post(`${BASE_URL}/groups`, groupData);
    return response;
  },

  addItem: async (itemData) => {
    const response = await axiosClient.post(`${BASE_URL}/items`, itemData);
    return response;
  },

  assignToFood: async (foodId, groupId) => {
    const response = await axiosClient.post(`${BASE_URL}/assign`, { 
      foodId, 
      groupId 
    });
    return response;
  },

  removeFromFood: async (foodId, groupId) => {
    const response = await axiosClient.delete(`${BASE_URL}/assign`, { 
      data: { foodId, groupId } 
    });
    return response;
  },

  getFoodCustomization: async (foodId) => {
    const response = await axiosClient.get(`${BASE_URL}/food/${foodId}`);
    return response;
  }
};

export default optionService;