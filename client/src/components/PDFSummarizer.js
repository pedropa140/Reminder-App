import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import { updateUserInfo, getStreakAndLastActivity, sendMessageToGemini } from '../api'; // Import your API call function
import './PDFSummarizer.css'; // Import the CSS file for styling
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup'; 
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/webpack'; // Ensure correct import

// Set PDF worker
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const formatResponseText = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")                // Bold formatting
        .replace(/^\* /gm, "<li>")                             // Convert '*' bullet points to list items
        .replace(/<\/li>\s*<li>/g, "</li><li>")                // Properly close list items
        .replace(/<\/li>\s*$/g, "</li>")                       // Close last list item
        .replace(/<li>/g, "<li>")                              // List item open tag
        .replace(/<\/li>/g, "</li>")                           // List item close tag
        .replace(/^(<li>.*<\/li>\s*)+$/gm, "<ul>$&</ul>")      // Wrap multiple list items in <ul> tags
        .replace(/\n/g, "<br>");                               // Replace newlines with <br> tags
};

const PDFSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(''); // State to hold the summary
  const [loading, setLoading] = useState(false); // State to manage loading

  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  const [streak, setStreak] = React.useState(0); // State for user's streak

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
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleUpdateUserInfo = async (updatedData) => {
    try {
      const response = await updateUserInfo(updatedData);
      if (response.user) {
        sessionStorage.setItem('firstName', updatedData.name.split(' ')[0]);
        sessionStorage.setItem('lastName', updatedData.name.split(' ')[1] || '');
        sessionStorage.setItem('userEmail', updatedData.newEmail || email);

        setFirstName(updatedData.name.split(' ')[0]);
        setLastName(updatedData.name.split(' ')[1] || '');
        setEmail(updatedData.newEmail || email);
      }
      setSettingsOpen(false);
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  // Fetch streak information when the page loads
  useEffect(() => {
    if (!sessionStorage.getItem('userEmail')) {
      navigate('/logged-out', { replace: true });
    } else {
      // Call API to fetch streak data
      getStreakAndLastActivity(email)
        .then(({ streak }) => {
          setStreak(streak); // Set the streak from the API response
        })
        .catch(error => {
          console.error('Error fetching streak information:', error);
        });
    }
  }, [email, navigate]);

  const extractTextFromPage = async (page) => {
    const textContent = await page.getTextContent();
    return textContent.items.map(item => item.str).join(' ');
  };

  const getTextFromPDF = async (file) => {
    try {
      const loadingTask = getDocument(URL.createObjectURL(file));
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const newTextContent = {};
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const text = await extractTextFromPage(page);
        newTextContent[i] = text;
      }
      return Object.values(newTextContent).join(' '); // Join all pages' text
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return ''; // Return an empty string if there's an error
    }
  };

  const summarizeText = async (text) => {
    try {
      const response = await sendMessageToGemini([], text); // Send the PDF text to Gemini AI
      const formattedSummary = formatResponseText(response); // Apply formatting
      console.log('Formatted Summary:', formattedSummary); // Log the formatted summary
      setSummary(formattedSummary); // Set the formatted summary
      setLoading(false); // Hide loading message
    } catch (error) {
      console.error('Error summarizing text:', error);
      setLoading(false); // Hide loading message on error
    }
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      setLoading(true); // Show loading message
      const pdfText = await getTextFromPDF(file);
      setTimeout(async () => {
        await summarizeText(pdfText); // Summarize the extracted text after 2 seconds
      }, 2000); // 2 seconds delay
    }
    setSummary(''); // Reset summary when a new file is selected
  };

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
      <div className="pdf-summarizer">
        <h1>PDF Summarizer</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="file-input"
        />
        {loading && (
          <div className="loading-message">
            <h2>Loading summary, please wait...</h2>
          </div>
        )}
        {summary && !loading && (
          <div className="summary-container">
            <h2>Summary:</h2>
            <div
              className="summary-content"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        )}
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
        onUpdateUserInfo={handleUpdateUserInfo} // Pass the update handler
      />
    </div>
  );
};

export default PDFSummarizer;
