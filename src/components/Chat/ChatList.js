import React, { useEffect, useState } from "react";
import { fetchChats } from "../../services/chatApi";
import RoomChat from './RoomChat';
import PrivateChat from './PrivateChat';
import styles from './ChatList.module.css';
import UserSearch from "../search/UserSearch";



const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const data = await fetchChats(); 
      setChats(data);
    };

    getChats();
  }, []);
  const handleUserSelect = (user) => {
    // יצירת צ'אט פרטי חדש
    const newPrivateChat = {
      userId: user._id,
      userDetails: { username: user.username }, // פרטי המשתמש
      lastMessage: "", // הודעה ריקה בינתיים
      timeSendLastMessage: new Date(), // זמן עדכני
      type:"privateChat"
    };

    // עדכון רשימת הצ'אטים
    setChats((prevChats) => ({
      ...prevChats,
      privateChats: [...(prevChats.privateChats || []), newPrivateChat],
    }));
  };

  return (
    <div>
  <h3 className={styles.ChatList}>Chats</h3>
  <UserSearch onUserSelect={handleUserSelect} existingChats={chats.privateChats || []}/>

  {Object.entries(chats || {}).map(([chatType, chatList]) =>
    chatList?.map((chat) => {
      if (chatType === "rooms") {
        return <RoomChat  onSelectChat={onSelectChat} chat={chat} />;
      } else if (chatType === "privateChats") {
        return <PrivateChat onSelectChat={onSelectChat} chat={chat} />;
      }; 
    })
  )}
</div>

  );
};

export default ChatList;
