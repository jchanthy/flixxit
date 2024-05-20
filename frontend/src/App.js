import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AllRouters from "./AllRouters";
import { AuthContext } from './AuthContext';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("flixxItToken") || "");
  const navigate = useNavigate();
  const { login, logout, isLoggedIn, user } = useContext(AuthContext);

  const fetchUser = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("flixxItUser"));
      if (!userData || !token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `https://flixxit-h9fa.onrender.com/api/user/${userData.id}`,
        { headers }
      );

      login(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [login, token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("flixxItToken", token);
    } else {
      localStorage.removeItem("flixxItToken");
    }
  }, [token]);

  const handleRegister = async (username, email, password) => {
    try {
      const response = await axios.post("https://flixxit-h9fa.onrender.com/api/register", {
        username,
        email,
        password,
      });
      const userId = response.data.userId;
      localStorage.setItem("flixxItUser", JSON.stringify({ id: userId }));
      navigate(`/login`);
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      alert("Registration failed: " + (error.response?.data?.message || "An error occurred"));
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "https://flixxit-h9fa.onrender.com/api/login",
        { email, password }
      );
      const data = response.data;
      login(data.user);
      setToken(data.token);
      localStorage.setItem("flixxItUser", JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + (error.response?.data?.message || "An error occurred"));
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    setToken("");
    localStorage.removeItem("flixxItUser");
    navigate("/login");
  };

  const handleSearch = async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await axios.get(`https://flixxit-h9fa.onrender.com/api/movies/search?query=${encodedQuery}`);
      return response.data;
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed: " + (error.response?.data?.message || "An error occurred"));
      return [];
    }
  };

  const handleLike = async (movieId) => {
    try {
      if (!user) {
        throw new Error("User not logged in");
      }
      const response = await axios.post("https://flixxit-h9fa.onrender.com/api/like", {
        userId: user._id,
        movieId,
      });
      console.log("Like successful:", response.data);
      return response.data.likes;
    } catch (error) {
      console.error("Like failed:", error);
      return null;
    }
  };

  const handleDislike = async (movieId) => {
    try {
      if (!user) {
        throw new Error("User not logged in");
      }
      const response = await axios.post("https://flixxit-h9fa.onrender.com/api/dislike", {
        userId: user._id,
        movieId,
      });
      console.log("Dislike successful:", response.data);
      return response.data.dislikes;
    } catch (error) {
      console.error("Dislike failed:", error);
      return null;
    }
  };

  return (
    <AllRouters
      isLoggedIn={isLoggedIn}
      handleLogout={handleLogout}
      handleLogin={handleLogin}
      handleRegister={handleRegister}
      handleSearch={handleSearch}
      handleLike={handleLike}
      handleDislike={handleDislike}
    />
  );
};

export default App;
