import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/users";

export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
  
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };
  

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};