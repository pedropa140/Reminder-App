import React, { useState, useEffect } from 'react';
import { IconButton } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined, Refresh } from "@mui/icons-material";
import './Chatbot.css';
import '../App.css';
import ReactStars from 'react-stars';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import { sendMessage, regenerateMessage, updateUserInfo } from '../api';
import logo from '../icon.png';

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = useState(sessionStorage.getItem('userEmail'));

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    }
  }, [navigate]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogoutClick = () => setPopupOpen(true);

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    setPopupOpen(false);
    navigate('/logged-out', { replace: true });
  };

  const handleClosePopup = () => setPopupOpen(false);

  const handleSettingsClick = () => setSettingsOpen(true);

  const handleCloseSettings = () => setSettingsOpen(false);

  const handleUpdateUserInfo = async (updatedData) => {
    try {
      const response = await updateUserInfo(updatedData);

      if (response.user) {
        const [newFirstName, newLastName] = updatedData.name.split(' ');
        sessionStorage.setItem('firstName', newFirstName);
        sessionStorage.setItem('lastName', newLastName || '');
        sessionStorage.setItem('userEmail', updatedData.newEmail || email);

        setFirstName(newFirstName);
        setLastName(newLastName || '');
        setEmail(updatedData.newEmail || email);
      }

      setSettingsOpen(false);
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  const handleButtonClick = (index, button) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map((msg, idx) => {
        if (idx === index && !msg.feedbackGiven) {
          if (button === 'thumbDown') {
            return { ...msg, thumbsUp: false, thumbsDown: true, feedbackGiven: true };
          } else if (button === 'thumbUp') {
            return { ...msg, thumbsUp: true, thumbsDown: false, feedbackGiven: true };
          }
        }
        return msg;
      });

      if (!updatedMessages.some(msg => msg.text === "Thank you for your feedback!")) {
        updatedMessages.push({
          text: "Thank you for your feedback!",
          role: "bot",
          timestamp: new Date(),
          thumbsUp: false,
          thumbsDown: false,
          feedbackGiven: true,
        });
      }

      return updatedMessages;
    });
  };

  const handleRefreshClick = async (index) => {
    try {
      const originalUserMessage = messages[index - 1];

      if (originalUserMessage && originalUserMessage.role === "user") {
        const regeneratedResponse = await regenerateMessage(originalUserMessage.text);

        setMessages(prevMessages =>
          prevMessages.map((msg, idx) => idx === index ? { ...msg, text: regeneratedResponse } : msg)
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

    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const botResponse = await sendMessage(userInput);

      const botMessage = {
        text: botResponse,
        role: "bot",
        timestamp: new Date(),
        thumbsUp: false,
        thumbsDown: false,
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setUserInput('');
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleRatingChange = (newRating) => {
    let message;

    switch (newRating) {
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
          <li><Link to="/user/pair">PAIR</Link></li>
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
            <ReactStars count={5} size={24} color2={'#ffd700'} onChange={handleRatingChange} />
          </div>
        </header>
        <main className={`chat-messages ${secondary}`}>
  {messages.map((msg, index) => (
    <div key={index} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
      <div className={`message-text ${msg.role === "user" ? "user-text" : "bot-text"}`}>
        {msg.role === "bot" ? (
          <div dangerouslySetInnerHTML={{ __html: msg.text }} />
        ) : (
          msg.text
        )}
      </div>
      {/* Timestamp for each message */}
      <div className="message-timestamp">
        {new Date(msg.timestamp).toLocaleString([], {
          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })}
      </div>
      {msg.role === "bot" && !msg.feedbackGiven && (
        <div className="feedback-buttons">
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
        </div>
      )}
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
          <button onClick={handleSendMessage} className={`send-button ${accent}`}>
            Send
          </button>
        </footer>
      </div>
      <LogoutPopup
        open={popupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmLogout}
      />
      <SettingsPopup
        open={settingsOpen}
        onClose={handleCloseSettings}
        firstName={firstName}
        lastName={lastName}
        email={email}
        onUpdateUserInfo={handleUpdateUserInfo}
      />
    </div>
  );
}
