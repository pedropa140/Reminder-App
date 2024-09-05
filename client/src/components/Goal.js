import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import { setGoal, getGoals, updateTaskStatus, updateGoalStatus } from '../api'; // Ensure updateGoalStatus is imported


const GoalPage = () => {
  const [goal, setGoalTitle] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [fetchedGoals, setFetchedGoals] = useState([]); // Store all fetched goals
  const email = sessionStorage.getItem('userEmail'); // Get user email from session
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (email) {
      getGoals(email)
        .then(response => {
          console.log("Fetched Goals:", response); // Add logging to check the response
          setFetchedGoals(response.data.activeGoals || []); // Ensure correct path to data
        })
        .catch(error => {
          console.error("Error fetching goals:", error);
        });
    } else {
      navigate('/logged-out', { replace: true });
    }
  }, [email, navigate]);

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
  
    // Update the state
    setFetchedGoals(updatedGoals);
  
    // Update the status in MongoDB
    const goalTitle = updatedGoals[goalIndex].title;
    const taskName = task.name;
  
    updateTaskStatus(email, goalTitle, taskName, updatedCompletedStatus)
      .then(() => {
        console.log('Task status updated successfully');
  
        // Check if all tasks are completed
        const allTasksCompleted = updatedGoals[goalIndex].activeTasks.every(t => t.completed);
  
        if (allTasksCompleted) {
          // Set the goal as completed and update MongoDB
          const updatedGoal = { ...updatedGoals[goalIndex], completed: true };
          const updatedUserGoals = [...fetchedGoals];
          updatedUserGoals[goalIndex] = updatedGoal;
  
          setFetchedGoals(updatedUserGoals);
  
          // Call the backend to update the goal status
          updateGoalStatus(email, goalTitle, true)
            .then(() => {
              console.log('Goal status updated successfully');
              window.location.reload(); // Refresh the page
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
          setGoalTitle(''); // Clear goal input
          setTasks(['']); // Clear tasks input
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
          <li><Link to="/user/pomodoro">POMODORO TIMER</Link></li>
          <li><Link to="/user/contact">CONTACT</Link></li>
          <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>
        </ul>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </nav>
      <Container>
        <Box>
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
        {fetchedGoals.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5">Your Goals</Typography>
            {fetchedGoals.map((goal, goalIndex) => (
              <Box key={goalIndex} mb={2}>
                <Typography variant="h6">{goal.title}</Typography>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {goal.activeTasks.map((task, taskIndex) => (
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
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        )}
      </Container>
      <LogoutPopup
        open={popupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default GoalPage;
