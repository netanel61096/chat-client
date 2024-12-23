import React, { useEffect, useState } from "react";
import styles from './PrivateChat.module.css'


const PrivateChat = ({ onSelectChat,chat }) => {
    const formatTime = (timeString) => {
        const date = new Date(timeString);

        const options = {
          timeZone: "Asia/Jerusalem", 
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const today = new Date();
        const isSameDay =
          today.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" },options) ===
          date.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" },options);
      
        if (isSameDay) {
          return date.toLocaleTimeString("he-IL", {
            timeZone: "Asia/Jerusalem",
            hour: "2-digit",
            minute: "2-digit",
          });
        } else {
          return date.toLocaleDateString("he-IL", {
            timeZone: "Asia/Jerusalem",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
      };
      
return(
    <div
    key={chat.userId}
    className={styles.PrivateChat}
    onClick={() => onSelectChat(chat)}
  >
    <div>
    <div>{chat.userDetails.username}</div>
    <div className={styles.lastMsg}>{chat.lastMessage}</div>
    </div>
    <div className={styles.time}>{formatTime(chat?.timeSendLastMesagge)}</div>
  </div>
)
};

export default PrivateChat;