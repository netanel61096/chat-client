import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // כתובת השרת

export default socket;
