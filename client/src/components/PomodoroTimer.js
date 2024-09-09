import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import logo from '../icon.png';
import '../App.css';
//import TimerAlertPopup from './TimerAlertPopup';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import { deleteTag, getAllTags, addTag, updateUserInfo, logPomodoroSession } from '../api';
import axios from 'axios';


const PomodoroTimer = () => {
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [time, setTime] = useState(workDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    const alarmSound = useRef(null);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = React.useState(false);
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false); // State for settings popup
    const [tags, setTags] = useState([]);
    //const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const API_URL = 'http://localhost:5000';
    const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
    const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
    const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
    //const email = sessionStorage.getItem('userEmail');
    const [selectedTag, setSelectedTag] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pomQuality, setPomQuality] = useState(null);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
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


    useEffect(() => {
        if(!email){
            navigate('/logged-out', {replace: true});
            return;
        }
       
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${API_URL}/timers/getTags/${email}`);
                //const response = await getAllTags(email);
                //const response = await axios.get(`${API_URL}/timers/getTags`, { params: { email } }); // grab user's tags
                console.log(response.data.tags);
                setTags(response.data.tags);//set tags
            }
            catch (error) {
                console.error("Error fetching tags:", error);
            }
        
        };
        fetchTags();
    
    }, [email]);

    const addTag = async () => {
        if (newTag.trim()) {
            try {
                const updatedTags = [...tags, newTag.trim()];
                setTags(updatedTags);
                setNewTag('');

                await axios.post(`${API_URL}/timer/addTag`, { email, newTag: newTag.trim() });

            }
            catch (error) {
                console.error("Error adding tag:", error)
            }
        }
    };

    const deleteTags = async (tagName) => {
        try {
            //await deleteTag(email, tagName);
            
            //setTags(tags.filter((tag) => tag !== tagName));
            // setTags(prevTags => prevTags.filter(t => t !== tagName));
            // setTags(updatedTags)l\;
            console.log('Tags before deletion:', tags); // Log state before deletion
            await deleteTag(email, tagName); // Delete the tag
            setTags(prevTags => prevTags.filter(t => t !== tagName));
            //const updatedTags = tags.filter(t => t !== tagName); // Remove the tag from the state
            //console.log('Tags after deletion:', updatedTags); // Log updated state
            //setTags(updatedTags); // Update state
            window.location.reload();
        }
        catch (error) {
            console.error("Error deleting tag:", error);
        }
    };


    // const promptUserForQuality = () => {
    //     const rating = window.prompt("How productive did you feel? (0 - 5)");
    //     // const ratingMap = {
    //     // A: 5,
    //     // B: 4,
    //     // C: 3,
    //     // D: 2,
    //     // E: 1,
    //     // F: 0

    //     // };
    //     return rating || -1; //Default to -1 if rating is 
    // }
    const handleModalSubmit = (rating) => {
        setPomQuality(rating);
        logPomodoroSession(email, workDuration * 60, selectedTag, rating);
      };

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);

            if (time === 0) {
                clearInterval(interval);
                playAlarm();

                if (isBreak) {
                    setAlertMessage('Break time is over! Time to get back to work.');
                    setTime(workDuration * 60);
                    setIsBreak(false);
                } else {
                    setIsModalOpen(true);
                    // setAlertMessage('Work session is over! Time for a break.');
                    // const pomQuality = promptUserForQuality();
                    // logPomodoroSession(email,workDuration*60, selectedTag || 'Unlisted', pomQuality)
                    setTime(breakDuration * 60);
                    setIsBreak(true);
                }
                setOpenAlert(true);
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, time, isBreak, workDuration, breakDuration]);

    const RatingAlert = ({ isOpen, onClose, onSubmit }) => {
        const [rating, setRating] = useState("");
      
        const handleSubmit = () => {
          onSubmit(rating);
          onClose();
        };
      
        if (!isOpen) return null;
      
        return (
            <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grey overlay with transparency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200, // Ensure it appears above other elements
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          textAlign: 'center',
          minWidth: '300px',
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: '16px' }}>
            Work session is over! Time for a break.
        </Typography>
        <Typography variant="p" sx={{ marginBottom: '16px' }}>
            Please rate your productivity (0 - 5):
        </Typography>
        <input
                type="number"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter your rating"
              />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ borderRadius: '8px' }}
          >
            OK
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>


            
        //   <div className="modal">
        //     <div className="modal-content">
        //       <h3>Work session is over! Time for a break.</h3>
        //       <p>Please rate your productivity (0 - 5):</p>
        //       <input
        //         type="number"
        //         min="0"
        //         max="5"
        //         value={rating}
        //         onChange={(e) => setRating(e.target.value)}
        //         placeholder="Enter your rating"
        //       />
        //       <div className="modal-buttons">
        //         <button onClick={handleSubmit}>OK</button>
        //         <button onClick={onClose}>Cancel</button>
        //       </div>
        //     </div>
        //   </div>
        );
      };

    const toggleTimer = async () => {
    let objectiveTag = selectedTag;
    if (!selectedTag){
        if(!tags.includes("Unlisted")){
            try{
                await addTag(email,"Unlisted");
                setTags([...tags, "Unlisted"]);
            }
            catch (error){
                console.error("Error creating 'Unlisted' tag:")
                return;
            }
        }
        objectiveTag = "Unlisted";
        
    }
    setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTime(workDuration * 60);
    };

    const handleWorkDurationChange = (e) => {
        setWorkDuration(e.target.value);
        if (!isActive) {
            setTime(e.target.value * 60);
        }
    };

    const handleBreakDurationChange = (e) => {
        setBreakDuration(e.target.value);
    };

    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.play();
        }
    };

    // const handleCloseAlert = () => {
    //     setOpenAlert(false);
    //     setIsActive(true);
    // };

    // const handleCancelAlert = () => {
    //     setOpenAlert(false);
    //     setIsActive(false);
    // };

    // Function to pause the timer and open the logout popup
    const handleLogoutClick = () => {
        if (isActive) {
            setIsActive(false); // Pause the timer
        }
        setLogoutPopupOpen(true);
    };

    const handleConfirmLogout = () => {
        sessionStorage.clear();
        setLogoutPopupOpen(false);
        navigate('/logged-out', { replace: true });
    };

    const handleCloseLogoutPopup = () => {
        setLogoutPopupOpen(false);
        if (!isActive && time > 0) {
            setIsActive(true); // Resume the timer if it was paused
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
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
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 4,
                        border: '1px solid',
                        borderRadius: '12px',
                        boxShadow: 3,
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {isBreak ? 'Break Time' : 'Work Time'}
                    </Typography>
                    <Typography variant="h1" gutterBottom>
                        {formatTime(time)}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                        <TextField
                            label="Work Duration (minutes)"
                            type="number"
                            value={workDuration}
                            onChange={handleWorkDurationChange}
                            disabled={isActive}
                            sx={{ mr: 2 }}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                        <TextField
                            label="Break Duration (minutes)"
                            type="number"
                            value={breakDuration}
                            onChange={handleBreakDurationChange}
                            disabled={isActive}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                    </Box>

                    <div className="tag-selector">
    <label htmlFor="tagDropdown">Select Tag: </label>
    <select 
        id="tagDropdown" 
        value={selectedTag} 
        onChange={(e) => setSelectedTag(e.target.value)}
    >
        <option value="">Select a tag</option>
        {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
        ))}
    </select>
</div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleTimer}
                        sx={{ mt: 2 }}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={resetTimer}
                        sx={{ mt: 2 }}
                    >
                        Reset
                    </Button>

                    {/* <TimerAlertPopup
                        open={openAlert}
                        onClose={handleCancelAlert}
                        alertMessage={alertMessage}
                        onConfirm={handleCloseAlert}
                    /> */}
                    <RatingAlert
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleModalSubmit}
                        />
                    

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
                    <Box sx={{ mt: 4, width: '100%' }}>
                        <Typography variant="h6">Tags:</Typography>
                        {/* {tags.length > 0 ? (
                            tags.map((tag, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}
                                >
                                    <Typography variant="body1">{tag}</Typography>
                                    <Button onClick={() => deleteTag(tag)}>

                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">No tags available.</Typography>
                        )} */}
                         <div className="tag-container">
            {tags.map(tag => (
                <span key={tag} className="tag">
                    {tag}
                    <button className="delete-btn" onClick={() => deleteTags(tag)}>x</button>
                    
                </span>
            ))}
        </div>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                            <TextField
                                label="New Tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                fullWidth
                            />
                            <Button onClick={() => addTag(email, newTag)} variant="contained" sx={{ ml: 2 }}>
                                Add Tag
                            </Button>
                            {/* <Button onClick={() => deleteTag(tag)} variant="outlined" color="error">
    Delete
</Button> */}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default PomodoroTimer;