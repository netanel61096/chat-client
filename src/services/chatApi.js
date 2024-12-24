import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export const fetchChats = async () => {
  const tokenString = localStorage.getItem("token");
  if (!tokenString) {
    throw new Error("Token not found. Please login again.");
  }

  const tokenData = JSON.parse(tokenString);

  if (Date.now() > tokenData.expiresAt) {
    localStorage.removeItem("token"); 
    throw new Error("Token has expired. Please login again.");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/chats`, {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chats:", error.response?.data || error.message);
    throw error; 
  }
};


export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
  return response.data;
};
