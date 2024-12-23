import React, { useState, useEffect } from "react";
import socket from "../../services/socket";
import { sendMessage } from "../../services/chatApi";
import {jwtDecode} from "jwt-decode";
import { fetchMessagesByRoomId, getPrivateMessages } from "../../services/messageApi";
import styles from './ChatBox.module.css';
import { IoSendOutline } from "react-icons/io5";

const ChatBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // שליפת מזהה המשתמש המחובר מהטוקן
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setLoggedInUserId(decodedToken.id);
  }, []);

  useEffect(() => {
    // האזנה להודעות נכנסות
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      let data;
      try {
        if (chat.type === "privateChat") {
          data = await getPrivateMessages(chat.myId, chat.userId);
        } else {
          data = await fetchMessagesByRoomId(chat._id);
        }
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error.message);
      }
    };

    if (chat) {
      fetchMessages(); // שליפת הודעות כאשר הצ'אט משתנה
    }
  }, [chat]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageData = {
      ...(chat.type === "privateChat"
        ? { receiverId: chat.userId } // אם זה צ'אט פרטי
        : { roomId: chat._id }),
      content: message,
      senderId: loggedInUserId,
    };

    await sendMessage(messageData); // שליחת ההודעה לשרת
    socket.emit("send_message", messageData); // שידור ההודעה ב-WebSocket
    setMessage("");
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.nameChat}>
        {chat.type === "privateChat" ? chat.userDetails.username : chat.name}
      </div>

      {/* ההודעות */}
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.senderId === loggedInUserId
                ? styles.sentMessage // הודעה שנשלחה (שמאל)
                : styles.receivedMessage // הודעה שהתקבלה (ימין)
            }
          >
            <div className={styles.messageContent}>
              <span>{msg.content}</span>
              <div className={styles.messageInfo}>
                {msg.senderId === loggedInUserId && (
                  <span className={styles.messageStatus}>
                    {msg.readBy?.length > 0
                      ? "✔✔️" 
                      : msg.deliveredAt
                      ? "✔✔️" 
                      : "✔️"} 
                  </span>
                )}
                <span className={styles.messageTime}>{formatMessageTime(msg.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.input}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.inputMsg}
        />
        <button onClick={handleSendMessage} className={styles.buttonSend}>
          <IoSendOutline />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
