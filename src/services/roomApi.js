import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/rooms";


export const createRoom = async (roomData) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await axios.post(`${API_BASE_URL}/`, roomData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error creating room:", error.response?.data || error.message);
    throw error;
  }
};
export const addUserToRoom = async (roomId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${roomId}/add-user`, 
      { userId }
    );
    return response.data; 
  } catch (error) {
    console.error("Error adding user to room:", error.response?.data || error.message);
    throw error;
  }
};