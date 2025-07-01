// src/hooks/useAuth.js
import { useState } from 'react';

const useAuth = (onLoginSuccess, onLogout) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setShowLoginPage(false);
      if (loginEmail.includes('admin') || loginPassword.includes('admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoginEmail('');
      setLoginPassword('');
      onLoginSuccess(); // Callback khi đăng nhập thành công
    } else {
      alert('Vui lòng nhập email và mật khẩu.');
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsLoggedIn(true);
    setShowLoginPage(false);
    setLoginEmail('');
    setLoginPassword('');
    onLoginSuccess(true); // Callback khi đăng nhập admin thành công
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowLoginPage(true);
    onLogout(); // Callback khi đăng xuất
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    showLoginPage,
    setShowLoginPage,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    isAdmin,
    setIsAdmin,
    handleLogin,
    handleAdminLogin,
    handleLogout,
  };
};

export default useAuth;