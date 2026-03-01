import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
// no backend auth for admin -- using localStorage

function Navbar() {
  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem('adminLogged') === 'true';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminLogged');
    setIsLogged(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/" className="home-link">
          Ana Sayfa
        </Link>
        <Link to="/ekler">Ekler</Link>
      </div>
      <div className="right">
        {isLogged ? (
          <>
            <Link to="/admin">Admin</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/admin">Admin Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
