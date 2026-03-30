import axiosClient from '../api/axiosClient';

const BASE_URL = 'FoodO/options'; 

const optionService = {
  // Tạo nhóm tùy chọn (Size, Topping...)
  createGroup: async (groupData) => {
    // groupData: { name, shop_id, is_required }
    const response = await axiosClient.post(`${BASE_URL}/groups`, groupData);
    return response;
  },

  // Thêm món lẻ vào nhóm (M trân châu, L trân châu...)
  addItem: async (itemData) => {
    // itemData: { group_id, name, price, is_available }
    const response = await axiosClient.post(`${BASE_URL}/items`, itemData);
    return response;
  },

  // Gán một nhóm tùy chọn cho món ăn cụ thể
  assignToFood: async (foodId, groupId) => {
    const response = await axiosClient.post(`${BASE_URL}/assign`, { 
      foodId, 
      groupId 
    });
    return response;
  },

  // Lấy toàn bộ cấu trúc tùy chọn của một món ăn
  getFoodCustomization: async (foodId) => {
    const response = await axiosClient.get(`${BASE_URL}/food/${foodId}`);
    return response;
  }
};

export default optionService;