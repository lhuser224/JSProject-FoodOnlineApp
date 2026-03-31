import axiosClient from '../api/axiosClient';

const BASE_URL = 'FoodO/addresses';

const addressService = {
  getAddresses: async () => {
    const response = await axiosClient.get(`${BASE_URL}/`);
    return response;
  },

  createAddress: async (addressData) => {
    const response = await axiosClient.post(`${BASE_URL}/`, addressData);
    return response;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosClient.delete(`${BASE_URL}/${addressId}`);
    return response;
  },

  updateAddress: async (addressId, updateData) => {
    const response = await axiosClient.patch(`${BASE_URL}/${addressId}`, updateData);
    return response;
  },

  setDefaultAddress: async (addressId) => {
    const response = await axiosClient.patch(`${BASE_URL}/${addressId}/default`);
    return response;
  }
};

export default addressService;