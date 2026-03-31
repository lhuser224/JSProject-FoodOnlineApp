const UserAddress = require('../models/UserAddress');

const userAddressService = {
  async getAll(userId) {
    return await UserAddress.findByUserId(userId);
  },

  async create(userId, addressData) {
    if (!addressData.receiver_phone || !addressData.address_detail) {
      throw new Error('Thiếu thông tin người nhận hoặc địa chỉ chi tiết');
    }

    const existing = await UserAddress.findByUserId(userId);
    const isDefault = existing.length === 0 ? 1 : 0;

    return await UserAddress.create({
      ...addressData,
      user_id: userId,
      is_default: isDefault
    });
  },

  async update(userId, addressId, updateData) {
    const address = await UserAddress.findById(addressId);
    if (!address || address.user_id != userId) {
      throw new Error('Địa chỉ không tồn tại hoặc bạn không có quyền');
    }
    return await UserAddress.update(addressId, updateData);
  },

  async delete(userId, addressId) {
    const address = await UserAddress.findById(addressId);
    if (!address || address.user_id != userId) {
      throw new Error('Địa chỉ không tồn tại hoặc bạn không có quyền');
    }
    return await UserAddress.delete(addressId);
  },

  async setDefault(userId, addressId) {
    const address = await UserAddress.findById(addressId);
    if (!address || address.user_id != userId) {
      throw new Error('Địa chỉ không tồn tại hoặc bạn không có quyền');
    }
    return await UserAddress.updateDefault(userId, addressId);
  }
};

module.exports = userAddressService;