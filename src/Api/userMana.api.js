import axios from 'axios';

const API_URL = 'http://localhost:8000/api/inventory';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    const users = (response.data.results || response.data).map((user) => ({
      id: user.id || user.username,
      fullName: user.username,
      email: user.email,
      role: user.role === 'Lab Admin' ? 'Admin' : user.role,
      lab: user.laboratory || 'N/A',
    }));
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}/`);
    return id;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, {
      username: userData.fullName,
      email: userData.email,
      role: userData.role,
      password: 'temporary123',
    });
    return {
      id: response.data.id,
      fullName: response.data.username,
      email: response.data.email,
      role: response.data.role,
      lab: 'N/A',
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
