import React ,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession, logout } from "./store/userSlice";
import {jwtDecode} from "jwt-decode";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home";
import './App.css'
const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const { token, expiresAt } = JSON.parse(tokenData);

      try {
        const decoded = jwtDecode(token);
        if (Date.now() > expiresAt) {
          localStorage.removeItem("token");
          dispatch(logout());
        } else {
          const user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
          };

          dispatch(restoreSession({ user }));
        }
      } catch (error) {
        console.error("Invalid token:", error.message);
        localStorage.removeItem("token");
        dispatch(logout());
      }
    }
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
