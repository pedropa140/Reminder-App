import React, { useState } from 'react';
import { IconButton } from "@mui/material";
import { Container, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined, Refresh } from "@mui/icons-material";
import './Chatbot.css';
import '../App.css';
import ReactStars from 'react-stars';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup'
import { sendMessage, regenerateMessage, updateUserInfo } from '../api';
import logo from '../icon.png'; // Import API functions

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  
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

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    setPopupOpen(false);
    navigate('/logged-out', { replace: true });
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true); // Open the settings popup
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false); // Close the settings popup
  };

  // Function to handle user info update from SettingsPopup
  const handleUpdateUserInfo = async (updatedData) => {
    try {
      // Make API call to update user information
      const response = await updateUserInfo(updatedData);
      
      // Update the sessionStorage with the new data
      if (response.user) {
        sessionStorage.setItem('firstName', updatedData.name.split(' ')[0]);
        sessionStorage.setItem('lastName', updatedData.name.split(' ')[1] || '');
        sessionStorage.setItem('userEmail', updatedData.newEmail || email);

        // Update the local state to reflect the new data
        setFirstName(updatedData.name.split(' ')[0]);
        setLastName(updatedData.name.split(' ')[1] || '');
        setEmail(updatedData.newEmail || email);
      }

      setSettingsOpen(false); // Close the settings popup
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  React.useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    }
  }, [navigate]);

  const handleButtonClick = (index, button) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg, idx) => {
        if (idx === index) {
          if (msg.feedbackGiven) {
            return msg;
          }

          if (button === 'thumbDown') {
            return {
              ...msg,
              thumbsUp: false,
              thumbsDown: true,
              feedbackGiven: true,
            };
          } else if (button === 'thumbUp') {
            return {
              ...msg,
              thumbsUp: true,
              thumbsDown: false,
              feedbackGiven: true,
            };
          }
        }
        return msg;
      });

      const thankYouMessageExists = updatedMessages.some((msg) => msg.text === "Thank you for your feedback!");

      if (!thankYouMessageExists) {
        const thankYouMessage = {
          text: "Thank you for your feedback!",
          role: "bot",
          timestamp: new Date(),
          thumbsUp: false,
          thumbsDown: false,
          feedbackGiven: true,
        };
        updatedMessages.push(thankYouMessage);
      }

      return updatedMessages;
    });
  };

  const handleRefreshClick = async (index) => {
    try {
      const originalUserMessage = messages[index - 1];

      if (originalUserMessage && originalUserMessage.role === "user") {
        const regeneratedResponse = await regenerateMessage(originalUserMessage.text);

        const newBotMessage = {
          text: regeneratedResponse,
          role: "bot",
          timestamp: new Date(),
          thumbsUp: false,
          thumbsDown: false,
        };

        setMessages((prevMessages) =>
          prevMessages.map((msg, idx) => (idx === index ? newBotMessage : msg))
        );
      }
    } catch (error) {
      setError("Failed to regenerate the response. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = {
      text: userInput,
      role: "user",
      timestamp: new Date(),
      thumbsUp: false,
      thumbsDown: false,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const botResponse = await sendMessage(userInput);

      const botMessage = {
        text: botResponse,
        role: "bot",
        timestamp: new Date(),
        thumbsUp: false,
        thumbsDown: false,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setUserInput('');
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
      case "dark":
        return {
          primary: "bg-gray-900",
          secondary: "bg-gray-800",
          accent: "bg-blue-500",
          text: "text-white",
        };
      default:
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
    }
  };

  const handleRatingChange = (newRating) => {
    let message;

    switch(newRating){
      case 0:
        message = "Sorry you didn't like this :(, would you like to tell us what could we improve on?";
        break;
      case 3:
        message = "Thank you for rating us! If anything what could we improve on?";
        break;
      case 5:
        message = "Wow! Glad you liked this. Nothing's ever perfect, is there anything you feel we could improve on?";
        break;
      default:
        message = "Thank you for your feedback!";
        break;
    }

    alert(message);
  };

  const { primary, secondary, accent, text } = getThemeColors();

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/user">HOME</Link></li>
          <li><Link to="/user/goal">TASKS</Link></li>
          <li><Link to="/pair">PAIR</Link></li>
          <li><Link to="/user/calendar">CALENDAR</Link></li>
          <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
          <li><Link to="/user/chatbot">CHATBOT</Link></li>
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
    <div className={`chat-container ${primary}`}>
      <header className="chat-header">
        <h1 className={`title ${text}`}>Gemini Chat</h1>
        <div className="rating-container">
          <h2 className="rating-text">Rate the ChatBot</h2>
          <ReactStars count={5} size={24} color2={'#ffd700'} onChange={handleRatingChange}/>
        </div>
        <div className="theme-selector">
          <label htmlFor="theme" className={`theme-label ${text}`}>Theme:</label>
          <select
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            className={`theme-select ${text}`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </header>
      <main className={`chat-messages ${secondary}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
          >
            <div
              className={`message-text ${msg.role === "user" ? "user-text" : "bot-text"}`}
              dangerouslySetInnerHTML={msg.role === "bot" ? { __html: msg.text } : undefined}
            >
              {msg.role === "user" ? msg.text : null}
            </div>
            <div className="feedback-buttons">
              {!msg.feedbackGiven && msg.role === "bot" && (
                <>
                  <IconButton
                    color={msg.thumbsUp ? "primary" : "default"}
                    onClick={() => handleButtonClick(index, 'thumbUp')}
                  >
                    {msg.thumbsUp ? <ThumbUp /> : <ThumbUpOutlined />}
                  </IconButton>
                  <IconButton
                    color={msg.thumbsDown ? "primary" : "default"}
                    onClick={() => handleButtonClick(index, 'thumbDown')}
                  >
                    {msg.thumbsDown ? <ThumbDown /> : <ThumbDownOutlined />}
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleRefreshClick(index)}
                  >
                    <Refresh />
                  </IconButton>
                </>
              )}
            </div>
          </div>
        ))}
        {error && <div className="error-message">{error}</div>}
      </main>
      <footer className="chat-input">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className={`input-textarea ${text}`}
        />
        <button onClick={() => handleSendMessage()} className={`send-button ${accent}`}>Send</button>
      </footer>
    </div>
    {/* Popup for logout confirmation */}
    <LogoutPopup
        open={popupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmLogout}
      />

      {/* Popup for settings with user info */}
      <SettingsPopup
        open={settingsOpen}
        onClose={handleCloseSettings}
        firstName={firstName}
        lastName={lastName}
        email={email}
        onUpdateUserInfo={handleUpdateUserInfo} // Pass the update handler
      />
    </div>
  );
}
