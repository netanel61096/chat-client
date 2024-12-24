import React, { useState, useEffect, useRef } from "react";
import socket from "../../services/socket";
import { sendMessage } from "../../services/chatApi";
import {jwtDecode} from "jwt-decode";
import { fetchMessagesByRoomId, getPrivateMessages } from "../../services/messageApi";
import UserSearchForAdd from "../search/UserSearchForAdd"; 
import styles from "./ChatBox.module.css";
import { IoSendOutline } from "react-icons/io5";
import { BsCheck2All } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";


const ChatBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false); // מצב הצגת המשתתפים
  const [showSearch, setShowSearch] = useState(false); // מצב הצגת חיפוש משתמשים
  const [participants, setParticipants] = useState([]); // משתתפי החדר
  const messagesEndRef = useRef(null); 


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.id);
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("token"); 
    }

  }, []);

  const createUniqueRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };


  useEffect(() => {
    if (!chat) return;
  
    const handleReceiveMessage = (data) => {
      if (
        (chat.type === "privateChat" && (data.receiverId === chat.myId ||  data.senderId === chat.userId || 
          data.receiverId === chat.userId ||  data.senderId === chat.myId)) || 
        (chat.type !== "privateChat" && data.roomId === chat._id) 
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };
    


    socket.removeAllListeners()
    socket.emit("leave_room");
    socket.emit("join_room", chat._id || createUniqueRoomId(chat.userId , chat.myId));
    socket.on("receive_message", handleReceiveMessage);
  

    setParticipants(chat.participants);

    const fetchMessages = async () => {
      try {
        let data;
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
  
    fetchMessages(); 
  }, [chat]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageData = {
      ...(chat.type === "privateChat"
        ? { receiverId: chat.userId } 
        : { roomId: chat._id }),
      content: message,
      senderId: loggedInUserId,
      createdAt:new Date()
    };

    await sendMessage(messageData); // שליחת ההודעה לשרת
    socket.emit("send_message", messageData); // שידור ההודעה ב-WebSocket
    setMessage("");
  };

  const handleUserAdded = (user) => {
    setParticipants((prev) => [...prev, user._id]); // עדכון המשתתפים
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        <div className={styles.nameChat}>
          <div>{chat.type === "privateChat" ? chat.userDetails.username : chat.name}</div>
          {chat.type !== "privateChat" && (
            <div className={styles.actionButtons}>
              <button
                className={styles.participantsButton}
                onClick={() => setShowParticipants((prev) => !prev)}
              >
                {showParticipants ? "Hide Participants" : "Show Participants"}
              </button>
              <button
                className={styles.searchButton}
                onClick={() => setShowSearch((prev) => !prev)}
              >
                {showSearch ? "Hide Search" : "Add Participants"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* רשימת המשתתפים */}
      {showParticipants && chat.type !== "privateChat" && (
        <div className={styles.participantsContainer}>
          <div className={styles.participants}>
            <h4>Participants:</h4>
            <ul>
              {participants.map((participant, index) => (
                <li key={index}>{participant.username}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* חיפוש משתמשים */}
      {showSearch && chat.type !== "privateChat" && (
        <div className={styles.userSearch}>
          <UserSearchForAdd
            roomId={chat._id}
            existingParticipants={participants}
            onUserAdded={handleUserAdded}
          />
        </div>
      )}

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
                      ? <BsCheck2All color="lightBlue"/>
                      : msg.deliveredAt
                      ? <BsCheck2All />
                      : <BsCheck2 />}
                  </span>
                )}
                <span className={styles.messageTime}>{formatMessageTime(msg.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className={styles.input}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.inputMsg}
          onKeyUp={(e)=>e.key==="Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className={styles.buttonSend}>
          <IoSendOutline />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
