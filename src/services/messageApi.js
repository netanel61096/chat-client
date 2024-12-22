import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/messages";

export const fetchMessagesByRoomId = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error.response?.data || error.message);
    throw error;
  }
};

export const getPrivateMessages = async (user1Id, user2Id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/private/${user1Id}/${user2Id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching private messages:", error.response?.data || error.message);
      throw error;
    }
  };
