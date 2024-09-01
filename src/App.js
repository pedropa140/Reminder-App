import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage'; // Ensure AboutPage.js exists
import LoginPage from './components/LoginPage'; // Import LoginPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add LoginPage route */}
      </Routes>
    </Router>
  );
}

export default App;
