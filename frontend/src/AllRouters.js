import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import MovieDetailPage from "./components/MovieDetailPage";
import AboutUs from "./components/AboutUs";
import MovieCategories from "./components/MovieCategories";
import WatchList from "./components/WatchList";
import UserProfile from "./components/UserProfile";
import SearchResults from "./components/SearchResults";
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from "./components/Admin/AdminLogin";
import PasswordReset from "./components/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthContext } from './AuthContext';

const AllRouters = ({ handleRegister, handleSearch, handleLike, handleDislike, isAdmin, handleLogin }) => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} handleLogout={logout} handleSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm handleRegister={handleRegister} />} />
        <Route path="/movies/:id" element={
          <MovieDetailPage handleLike={handleLike} handleDislike={handleDislike} />
        } />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/categories" element={<MovieCategories handleSearch={handleSearch} />} />
        <Route path="/search-page" element={<SearchResults handleSearch={handleSearch} />} />
        <Route path="/watchlist" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <WatchList user={user} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <UserProfile user={user} />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute isAdmin={isAdmin}>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </div>
  );
};

export default AllRouters;
