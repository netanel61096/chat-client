import React, { useEffect, useState } from "react";
import styles from './RoomChat.module.css'


const RoomChat = ({ onSelectChat,chat }) => {
return(
    <div
    key={chat._id}
    className={styles.RoomChat}
    onClick={() => onSelectChat(chat)}
  >
    <strong>{chat.name}</strong>
  </div>)
};

export default RoomChat;