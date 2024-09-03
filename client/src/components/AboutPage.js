import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../logo.svg';

function AboutPage() {
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
      <main>
        <section className="about-content">
          <h1 className="about-title">About Us</h1>
          <p className="about-description">
            Welcome to our website! We are committed to providing the best experience for our users. Our team is dedicated to delivering quality content and services. Feel free to explore and learn more about what we offer.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
