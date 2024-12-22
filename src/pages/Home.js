import React, { useState } from "react";
import ChatList from "../components/Chat/ChatList";
import ChatBox from "../components/Chat/ChatBox";
import styles from './Home.module.css'

const Home = () => {
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <div className={styles.Home}>
      <div className={styles.ChatList}>
        <ChatList onSelectChat={(chat) => setCurrentChat(chat)} />
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

