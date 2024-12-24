import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../services/authApi";
import { addUserToRoom } from "../../services/roomApi"; // פונקציה להוספת משתמש לחדר
import {jwtDecode} from "jwt-decode";
import styles from "./UserSearch.module.css";

const UserSearch = ({ roomId, existingParticipants, onUserAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);

  const getLoggedInUserId = () => {
    const tokenString = localStorage.getItem("token");
  
    if (!tokenString) {
      console.error("Token not found.");
      return null;
    }
  
    try {
      const tokenData = JSON.parse(tokenString);

      if (Date.now() > tokenData.expiresAt) {
        console.error("Token has expired.");
        localStorage.removeItem("token");
        return null;
      }
  
      const decoded = jwtDecode(tokenData.token);
      return decoded.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const loggedInUserId = getLoggedInUserId();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();

        // סינון משתמשים שכבר נמצאים בחדר או הם המשתמש המחובר
        const filteredUsers = users.filter(
          (user) =>
            user._id !== loggedInUserId &&
            !existingParticipants.some((participant) => participant.id === user._id)
        );

        setAllUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };

    loadUsers();
  }, [loggedInUserId, existingParticipants]);

  const handleSearch = (term) => {
    setSearchTerm(term);

    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleUserSelect = async (user) => {
    try {
      // קריאה לשרת להוספת המשתמש לחדר
      await addUserToRoom(roomId, user._id);

      // עדכון הרכיב החיצוני על הוספת המשתמש
      if (onUserAdded) {
        onUserAdded(user);
      }

      // הסרת המשתמש מהרשימה
      setAllUsers((prev) => prev.filter((u) => u._id !== user._id));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (error) {
      alert("Failed to add user to room: " + error.message);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for users..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={styles.input}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {isFocused && filteredUsers.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            right: 0,
            backgroundColor: "white",
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            borderRadius: "5px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleUserSelect(user)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
