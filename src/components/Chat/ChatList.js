import React, { useEffect, useState } from "react";
import { fetchChats } from "../../services/chatApi";
import RoomChat from "./RoomChat";
import PrivateChat from "./PrivateChat";
import styles from "./ChatList.module.css";
import UserSearch from "../search/UserSearch";
import RoomCreationForm from "../rooms/RoomCreationForm";
import { useSelector,useDispatch } from "react-redux";
import { TbMenu2 } from "react-icons/tb";
import { logout } from "../../store/userSlice";

const ChatList = ({ onSelectChat, handleDeleteAccount }) => {
  const [chats, setChats] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = async () => {
      const data = await fetchChats();
      setChats(data);
    };

    getChats();
  }, []);

  const handleUserSelect = (user) => {
    const newPrivateChat = {
      myId:userId.user.id,
      userId: user._id,
      userDetails: { username: user.username },
      lastMessage: "",
      timeSendLastMessage: new Date(),
      type: "privateChat",
    };
    setChats((prevChats) => ({
      ...prevChats,
      privateChats: [...(prevChats.privateChats || []), newPrivateChat],
    }));
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); 
    window.location.reload(); 
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.welcome}>
          <h2>{`Welcome ${userId.user.name}`}</h2>
          <h3 className={styles.ChatList}>Chats</h3>
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <TbMenu2 size={24} />
        </button>

        {menuOpen && (
          <div className={styles.menu}>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
            <RoomCreationForm />
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <UserSearch
        onUserSelect={handleUserSelect}
        existingChats={chats.privateChats || []}
      />

      {Object.entries(chats || {}).map(([chatType, chatList]) =>
        chatList?.map((chat) => {
          if (chatType === "rooms") {
            return (
              <RoomChat onSelectChat={onSelectChat} chat={chat} key={chat._id} />
            );
          } else if (chatType === "privateChats") {
            return (
              <PrivateChat
                onSelectChat={onSelectChat}
                chat={chat}
                key={chat.userId}
              />
            );
          }
          return null
        })
      )}
    </div>
  );
};

export default ChatList;
