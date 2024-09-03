import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/signup">SIGN UP</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
        </ul>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </div>
      </nav>
      <main className={`hero-section ${darkMode ? 'dark-hero-content' : ''}`}>
        <div className={`hero-content ${darkMode ? 'dark-hero-box' : ''}`}>
          <h1>Welcome to ReminderApp</h1>
          <p>Your personal assistant to stay organized and on top of your tasks.</p>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
