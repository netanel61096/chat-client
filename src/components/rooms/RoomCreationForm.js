import React, { useState } from "react";
import { useSelector } from "react-redux"; // לשליפת המידע מה-Redux
import { createRoom } from "../../services/roomApi";
import styles from "./RoomCreationForm.module.css";

const RoomCreationForm = () => {
  const [showForm, setShowForm] = useState(false); // ניהול מצב הצגת הטופס
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // שליפת המידע על המשתמש המחובר מ-Redux
  const userId = useSelector((state) => state.user.user);

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Please provide a room name and description");
      return;
    }

    try {
      const roomData = {
        name,
        description,
        createdBy: userId.user.id,
      };
      const response = await createRoom(roomData);
      alert("Room created successfully: " + response.newRoom.name);
      setName("");
      setDescription("");
      setShowForm(false); // סגירת הטופס לאחר יצירת החדר
    } catch (error) {
      alert("Error creating room: " + error.message);
    }
  };

  return (
    <div >
      {!showForm ? (
        <button
          className={styles.newRoomButton}
          onClick={() => setShowForm(true)}
        >
          Create New Room
        </button>
      ) : (
        <form onSubmit={handleCreateRoom} className={styles.form}>
          <h2>Create a New Room</h2>
          <input
            type="text"
            placeholder="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="Room Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>
            Create Room
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setShowForm(false)} // סגירת הטופס
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default RoomCreationForm;
