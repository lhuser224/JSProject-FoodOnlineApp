import axiosClient from '../api/axiosClient';

const validatePhone = (phone) => {
  const re = /^(0[3|5|7|8|9])([0-9]{8})$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  const re = /^(?=.*[a-zA-Z]).{8,}$/;
  return re.test(password);
};

export const login = async (phone, password) => {
  if (!phone || !password) {
    throw new Error('Số điện thoại và mật khẩu không được để trống');
  }
  if (!validatePhone(phone.trim())) {
    throw new Error('Số điện thoại không hợp lệ (phải có 10 chữ số)');
  }

  const payload = {
    phone: phone.trim(),
    password
  };

  const response = await axiosClient.post('/FoodO/auth/login', payload);
  return response;
};

export const register = async (fullName, phone, password, passwordConfirm) => {
  if (!fullName || !phone || !password || !passwordConfirm) {
    throw new Error('Vui lòng điền đầy đủ tất cả các trường');
  }
  if (fullName.trim().length < 2) {
    throw new Error('Họ và tên quá ngắn');
  }
  if (!validatePhone(phone.trim())) {
    throw new Error('Số điện thoại không hợp lệ');
  }
  if (!validatePassword(password)) {
    throw new Error('Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 chữ cái');
  }
  if (password !== passwordConfirm) {
    throw new Error('Mật khẩu xác nhận không khớp');
  }

  const payload = {
    full_name: fullName.trim(),
    phone: phone.trim(),
    password,
    role: 'customer'
  };

  const response = await axiosClient.post('/FoodO/auth/register', payload);
  return response;
};

export const updateProfile = async (userData) => {
  return await axiosClient.put('/FoodO/auth/profile', userData);
};

export const changePassword = async (oldPassword, newPassword) => {
  if (!validatePassword(newPassword)) {
    throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự và bao gồm ít nhất 1 chữ cái');
  }
  const payload = { oldPassword, newPassword };
  return await axiosClient.put('/FoodO/auth/change-password', payload);
};

export const getProfile = async () => {
  return await axiosClient.get('/FoodO/auth/me');
};

export default { login, register, updateProfile, changePassword, getProfile };