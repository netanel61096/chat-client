import React, { useState } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatBox from "../components/Chat/ChatBox";

const Home = () => {
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* רשימת הצ'אטים */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "scroll" }}>
        <ChatList onSelectChat={(chat) => setCurrentChat(chat)} />
      </div>

      {/* תיבת הצ'אט */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {currentChat ? (
          <ChatBox chat={currentChat} />
        ) : (
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <h2>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

