import React, { useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { IconButton } from "@mui/material";
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined, Refresh } from "@mui/icons-material";
import './Chatbot.css';
import ReactStars from 'react-stars';

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);

  const MODEL_NAME = "gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

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
        const result = await model.generateContent(originalUserMessage.text);
        const response = await result.response;
        const markdownText = response.text();

        let formattedText = markdownText
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/^\* /gm, "<li>")
          .replace(/<\/li>\s*<li>/g, "</li><li>")
          .replace(/<\/li>\s*$/g, "</li>")
          .replace(/<li>/g, "<li>")
          .replace(/<\/li>/g, "</li>")
          .replace(/^(<li>.*<\/li>\s*)+$/gm, "<ul>$&</ul>")
          .replace(/\n/g, "<br>");

        const newBotMessage = {
          text: formattedText,
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

  const handleSendMessage = async (replacePrompt = false) => {
    try {
      if (userInput.trim() === '') return;
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
        thumbsUp: false,
        thumbsDown: false,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const result = await model.generateContent(userInput);
      const response = await result.response;
      const markdownText = response.text();

      let formattedText = markdownText
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/^\* /gm, '<li>')
        .replace(/<\/li>\s*<li>/g, '</li><li>')
        .replace(/<\/li>\s*$/g, '</li>')
        .replace(/<li>/g, '<li>')
        .replace(/<\/li>/g, '</li>')
        .replace(/^(<li>.*<\/li>\s*)+$/gm, '<ul>$&</ul>')
        .replace(/\n/g, '<br>');

      const botMessage = {
        text: formattedText,
        role: "bot",
        timestamp: new Date(),
        thumbsUp: false,
        thumbsDown: false,
      };

      if (replacePrompt) {
        setMessages((prevMessages) => prevMessages.map((msg, idx) => {
          if (msg.role === "user" && !msg.thumbsUp && !msg.thumbsDown) {
            return { ...msg, text: formattedText };
          }
          return msg;
        }));
      } else {
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }

      setUserInput('');
    } catch (error) {
      setError("Failed to Send Message. Please Try Again" + error);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const { primary, secondary, accent, text } = getThemeColors();

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

  return (
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
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className={`input-textarea ${text}`}
        />
        <button onClick={() => handleSendMessage()} className={`send-button ${accent}`}>Send</button>
      </footer>
    </div>
  );
}
