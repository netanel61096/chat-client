import React, { useEffect, useState } from "react";
import { fetchChats } from "../../services/chatApi";
import RoomChat from './RoomChat';
import PrivateChat from './PrivateChat';
import styles from './ChatList.module.css'



const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const data = await fetchChats(); 
      setChats(data);
    };

    getChats();
  }, []);

  return (
    <div>
  <h3 className={styles.ChatList}>Chats</h3>
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
