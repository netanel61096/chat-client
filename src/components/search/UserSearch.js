import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../services/authApi";
import { jwtDecode } from "jwt-decode";
import styles from './UserSearch.module.css'


const UserSearch = ({ onUserSelect ,existingChats}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [isFocused, setIsFocused] = useState(false); 
  const [error, setError] = useState(null);

  const getLoggedInUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token); 
      return decoded.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const loggedInUserId = getLoggedInUserId();

  // שליפת כל המשתמשים מהשרת בעת טעינת הקומפוננטה
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers(); // שליפת כל המשתמשים מהשרת

        // סינון המשתמש המחובר
        const filteredUsers = users.filter(
          (user) =>
            user._id !== loggedInUserId &&
            !existingChats.some((chat) => chat.userId === user._id)
        );
        

        setAllUsers(filteredUsers); // שמירת המשתמשים המסוננים
        setFilteredUsers(filteredUsers); // הצגת כל המשתמשים כברירת מחדל
        setError(null); // איפוס שגיאות
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };

    loadUsers();
  }, [loggedInUserId,existingChats]); // ריצה מחדש אם מזהה המשתמש המחובר משתנה

  // חיפוש משתמשים מקומי בצד הלקוח
  const handleSearch = (term) => {
    setSearchTerm(term);

    // סינון המשתמשים לפי מונח החיפוש
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredUsers(filtered); // עדכון הרשימה המסוננת
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for users..."
        onFocus={() => setIsFocused(true)} // מפעיל את הצגת הרשימה
        onBlur={() => setIsFocused(false)} // מסתיר את הרשימה כאשר יוצאים מה-input
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
              onMouseDown={(e) => e.preventDefault()} // מונע את הפעלת ה-onBlur של ה-input
              onClick={() => onUserSelect(user)}
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
