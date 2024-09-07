import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import SettingsPopup from './SettingsPopup';
import { setGoal, getGoals, updateTaskStatus, updateGoalStatus, getCompletedGoals, deleteGoal, deleteTask, updateUserInfo } from '../api';

const GoalPage = () => {
  const [goal, setGoalTitle] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [fetchedGoals, setFetchedGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  // const email = sessionStorage.getItem('userEmail');
  const [firstName, setFirstName] = React.useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = React.useState(sessionStorage.getItem('lastName'));
  const [email, setEmail] = React.useState(sessionStorage.getItem('userEmail'));
  
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false); // State for settings popup

  const fetchGoalsAndCompletedGoals = () => {
    if (email) {
      console.log(`Fetching goals for user with email: ${email}`);
      
      getGoals(email)
        .then(response => {
          console.log("Fetched Goals:", response);
          const activeGoals = response.data?.activeGoals || [];
          setFetchedGoals(activeGoals.map(goal => ({
            ...goal,
            activeTasks: goal.activeTasks || []
          })));
        })
        .catch(error => {
          console.error("Error fetching goals:", error);
        });

      getCompletedGoals(email)
        .then(response => {
          console.log("Fetched Completed Goals:", response);
          setCompletedGoals(response.data?.completedGoals || []);
        })
        .catch(error => {
          console.error("Error fetching completed goals:", error);
        });
    }
  };

  useEffect(() => {
    fetchGoalsAndCompletedGoals();
  }, [email]);

  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };

  const handleChangeTask = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };

  const handleTaskCompletionChange = (goalIndex, taskIndex) => {
    const updatedGoals = [...fetchedGoals];
    const task = updatedGoals[goalIndex].activeTasks[taskIndex];
    const updatedCompletedStatus = !task.completed;
    task.completed = updatedCompletedStatus;

    setFetchedGoals(updatedGoals);

    const goalTitle = updatedGoals[goalIndex].title;
    const taskName = task.name;

    updateTaskStatus(email, goalTitle, taskName, updatedCompletedStatus)
      .then(() => {
        console.log('Task status updated successfully');
        
        const allTasksCompleted = updatedGoals[goalIndex].activeTasks.every(t => t.completed);

        if (allTasksCompleted) {
          const updatedGoal = { ...updatedGoals[goalIndex], completed: true };
          const updatedUserGoals = [...fetchedGoals];
          updatedUserGoals[goalIndex] = updatedGoal;

          setFetchedGoals(updatedUserGoals);

          updateGoalStatus(email, goalTitle, true)
            .then(() => {
              console.log('Goal status updated successfully');
              fetchGoalsAndCompletedGoals(); // Refetch goals and completed goals
            })
            .catch(error => {
              console.error('Error updating goal status:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };

  const handleDeleteGoal = (goalTitle, goalIndex) => {
    deleteGoal(email, goalTitle)
      .then(() => {
        console.log(`Goal "${goalTitle}" deleted successfully.`);
        // Remove goal from state
        const updatedGoals = [...fetchedGoals];
        updatedGoals.splice(goalIndex, 1); // Remove the deleted goal from the array
        setFetchedGoals(updatedGoals);
      })
      .catch(error => {
        console.error('Error deleting goal:', error);
      });
  };

const handleDeleteTask = (goalIndex, taskIndex, taskName) => {
    const goalTitle = fetchedGoals[goalIndex].title;
    deleteTask(email, goalTitle, taskName)
      .then(() => {
        console.log(`Task "${taskName}" deleted successfully.`);
        // Remove task from state
        const updatedGoals = [...fetchedGoals];
        updatedGoals[goalIndex].activeTasks.splice(taskIndex, 1); // Remove the deleted task from the array
        setFetchedGoals(updatedGoals);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };


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

  const handleSubmitGoal = () => {
    if (goal && tasks.length > 0) {
      setGoal({ email: email, goal: goal, tasks: tasks })
        .then(() => {
          setFetchedGoals([...fetchedGoals, {
            title: goal,
            activeTasks: tasks.map(t => ({ name: t, completed: false }))
          }]);
          setGoalTitle('');
          setTasks(['']);
        })
        .catch(error => {
          console.error("Error setting goal:", error);
        });
    }
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
      <Container>
        <Box mt={4}>
          <Typography variant="h4">Set Your Goal</Typography>
          <TextField
            label="Goal Title"
            value={goal}
            onChange={(e) => setGoalTitle(e.target.value)}
            fullWidth
          />
          <Box mt={2}>
            {tasks.map((task, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  label={`Task ${index + 1}`}
                  value={task}
                  onChange={(e) => handleChangeTask(index, e.target.value)}
                  fullWidth
                />
                <IconButton onClick={handleAddTask}>+</IconButton>
              </Box>
            ))}
          </Box>
          <Button variant="contained" onClick={handleSubmitGoal}>Submit Goal</Button>
        </Box>

        {/* Display all fetched goals */}
        {fetchedGoals.length > -1 ? (
          <Box mt={4}>
            <Typography variant="h5">Your Goals</Typography>
            {fetchedGoals.map((goal, goalIndex) => (
              <Box key={goalIndex} mb={2}>
                <Typography variant="h6">
                  {goal.title}
                  <Button color="error" onClick={() => handleDeleteGoal(goal.title, goalIndex)} style={{ marginLeft: '1rem' }}>
                    Delete Goal
                  </Button>
                </Typography>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {goal.activeTasks && Array.isArray(goal.activeTasks) ? (
                    goal.activeTasks.map((task, taskIndex) => (
                      <li key={taskIndex}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={task.completed}
                              onChange={() => handleTaskCompletionChange(goalIndex, taskIndex)}
                            />
                          }
                          label={task.name}
                        />
                        <Button color="error" onClick={() => handleDeleteTask(goalIndex, taskIndex, task.name)}>
                          Delete Task
                        </Button>
                      </li>
                    ))
                  ) : (
                    <Typography variant="body2">No tasks available</Typography>
                  )}
                </ul>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1">No active goals available</Typography>
        )}

        {/* Display completed goals */}
        {completedGoals.length > -1 ? (
          <Box mt={4}>
            <Typography variant="h5">Completed Goals</Typography>
            {completedGoals.map((goal, index) => (
              <Box key={index} mb={2}>
                <Typography variant="h6">{goal.title}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1">No completed goals available</Typography>
        )}
      </Container>

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
};

export default GoalPage;
