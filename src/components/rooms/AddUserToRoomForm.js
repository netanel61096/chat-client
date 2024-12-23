import React, { useState } from "react";
import { addUserToRoom } from "../../services/roomApi";
import styles from "./AddUserToRoomForm.module.css";

const AddUserToRoomForm = () => {
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!roomId || !userId) {
      alert("Please provide both Room ID and User ID");
      return;
    }

    try {
      const response = await addUserToRoom(roomId, userId);
      alert("User added successfully to the room");
      console.log("Room details:", response.room);
      setRoomId("");
      setUserId("");
    } catch (error) {
      alert("Error adding user to room: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddUser} className={styles.form}>
        <h2>Add User to Room</h2>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserToRoomForm;
