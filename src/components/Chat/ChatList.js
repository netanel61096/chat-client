import React, { useEffect, useState } from "react";
import { fetchChats } from "../../services/chatApi";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const data = await fetchChats(); // קריאה ל-API כדי לקבל רשימת צ'אטים
      setChats(data);
    };

    getChats();
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Chats</h3>
      {chats?.privateChats?.map((chat) => (
        <div
          key={chat._id}
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => onSelectChat(chat)}
        >
          <strong>{chat.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
