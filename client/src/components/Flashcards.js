import React from 'react';
import { useState } from "react";
import {
  Container, TextField, Button, Typography, Box, Card, CardContent
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

import Slider from "react-slick";
import { generateFlashcards } from "../api"; // Assuming API call is here
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from '../icon.png';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';


const Flashcards = () => {
  const [prompt, setPrompt] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogoutClick = () => {
    setPopupOpen(true);
  };
  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleGenerateFlashcards = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await generateFlashcards(prompt); // Ensure prompt is passed as string
      console.log("Flashcards response:", response); // Log the response
      setFlashcards(response.flashcards || []); // Ensure correct response format
    } catch (err) {
      setError("Failed to generate flashcards.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div  className={darkMode ? 'app dark-mode' : 'app'}>
        <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/user">HOME</Link></li>
          <li><Link to="/user/goal">TASKS</Link></li>
          <li><Link to="/user/pair">PAIR</Link></li>
          <li><Link to="/user/calendar">CALENDAR</Link></li>
          <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
          <li><Link to="/user/chatbot">CHATBOT</Link></li>
          <li><Link to="/user/pdfsummarizer">PDF SUMMARIZER</Link></li>
          <li><Link to="/user/flashcards">FLASHCARDS</Link></li>
          <li><Link to="/user/contact">CONTACT</Link></li>
          <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>
          <div className="settings-icon" onClick={handleSettingsClick}>
            <FaCog />
          </div>
        </ul>
        <div className="nav-actions">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div>
        </div>
      </nav>
        
    <Container>
      <Typography variant="h4" gutterBottom>Flashcard Generator</Typography>
      <Box mb={2}>
        <TextField
          label="Enter Text for Flashcards"
          multiline
          rows={4}
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateFlashcards}
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {flashcards.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5">Flashcards</Typography>
          <Slider {...settings}>
            {flashcards.map((card, index) => (
              <Box key={index} px={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Flashcard {index + 1}</Typography>
                    <Typography color="textSecondary">Front:</Typography>
                    <Typography>{card.front}</Typography>
                    <Typography color="textSecondary" mt={2}>Back:</Typography>
                    <Typography>{card.back}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Container>
    </div>

  );
};

export default Flashcards;
