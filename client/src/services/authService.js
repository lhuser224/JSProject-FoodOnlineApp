import axiosClient from '../api/axiosClient';

export const login = async (phone, password) => {
  try {
    if (!phone || !password) {
      throw new Error('Phone and password are required');
    }
    if (phone.length > 15) {
      throw new Error('Phone number must be max 15 characters');
    }

    const payload = {
      phone: phone.trim(),
      password
    };

    const response = await axiosClient.post('/auth/login', payload);

    // Store token if provided
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (fullName, phone, password) => {
  try {
    if (!fullName || !phone || !password) {
      throw new Error('Full name, phone, and password are required');
    }
    if (phone.length > 15) {
      throw new Error('Phone number must be max 15 characters');
    }

    const payload = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      password,
      role: 'customer' // Default role for new users
    };

    const response = await axiosClient.post('/auth/register', payload);

    // Store token if provided
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }

    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const forgotPassword = async (phone) => {
  try {
    if (!phone) {
      throw new Error('Phone number is required');
    }
    if (phone.length > 15) {
      throw new Error('Phone number must be max 15 characters');
    }

    const payload = { phone: phone.trim() };
    const response = await axiosClient.post('/auth/forgot-password', payload);
    return response;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    if (!phone || !otp) {
      throw new Error('Phone and OTP are required');
    }

    const payload = {
      phone: phone.trim(),
      otp: otp.toString()
    };

    const response = await axiosClient.post('/auth/verify-otp', payload);
    return response;
  } catch (error) {
    console.error('Error during OTP verification:', error);
    throw error;
  }
};

/**
 * Reset password with OTP token
 * @param {string} phone - Phone number
 * @param {string} token - OTP verification token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} { message, success: true }
 */
export const resetPassword = async (phone, token, newPassword) => {
  try {
    if (!phone || !token || !newPassword) {
      throw new Error('Phone, token, and new password are required');
    }

    const payload = {
      phone: phone.trim(),
      token,
      password: newPassword
    };

    const response = await axiosClient.post('/auth/reset-password', payload);
    return response;
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};


export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  login,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  logout,
  getCurrentUser,
  isAuthenticated
};
