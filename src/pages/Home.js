import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice"; 
import { deleteUser } from "../services/authApi";
import ChatList from "../components/Chat/ChatList";
import ChatBox from "../components/Chat/ChatBox";
import styles from "./Home.module.css";

const Home = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.user.id);
      dispatch(logout()); 
      alert("Account deleted successfully");
      navigate("/register"); 
    } catch (error) {
      console.error("Error deleting account:", error.message);
      alert("Failed to delete account");
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className={styles.Home}>
      <div className={styles.ChatList}>
        <ChatList onSelectChat={(chat) => setCurrentChat(chat)} handleDeleteAccount={handleDeleteAccount}/>
      </div>

      <div className={styles.ChatBox}>
        {currentChat ? (
          <ChatBox chat={currentChat} />
        ) : (
          <div className={styles.noChats}>
            <h2>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
