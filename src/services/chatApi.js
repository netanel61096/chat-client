import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export const fetchChats = async () => {
  const response = await axios.get(`${API_BASE_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // שליחת הטוקן
    },
  });
  
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
  return response.data;
};
