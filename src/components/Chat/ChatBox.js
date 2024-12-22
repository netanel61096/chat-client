import React, { useState, useEffect } from "react";
import socket from "../../services/socket";
import { sendMessage } from "../../services/chatApi";

const ChatBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // האזנה להודעות נכנסות
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageData = {
      chatId: chat._id,
      content: message,
    };

    await sendMessage(messageData); // שליחת ההודעה לשרת
    socket.emit("send_message", messageData); // שידור ההודעה ב-WebSocket
    setMessage("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* שם הצ'אט */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ccc", fontWeight: "bold" }}>
        {chat.name}
      </div>

      {/* ההודעות */}
      <div style={{ flex: 1, overflowY: "scroll", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <strong>{msg.senderName}: </strong>
            {msg.content}
          </div>
        ))}
      </div>

      {/* שדה להזנת הודעה */}
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "10px", marginRight: "10px" }}
        />
        <button onClick={handleSendMessage} style={{ padding: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
