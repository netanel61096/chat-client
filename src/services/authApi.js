import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/users";


export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};
  

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      throw error; 
    }
  };

  export const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}`);
  
      return response.data; 
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      throw error;
    }
  };
  
