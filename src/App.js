import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage'; // Ensure AboutPage.js exists
import LoginPage from './components/LoginPage'; // Import LoginPage
import SignUpPage from './components/SignUpPage'; // Import SignUpPage
import ContactPage from './components/ContactPage'; // Import ContactPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/contact" element={<ContactPage />} /> {/* Add ContactPage route */}
      </Routes>
    </Router>
  );
}

export default App;
