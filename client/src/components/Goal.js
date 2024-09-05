import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { setGoal, getGoal } from '../api';  // Assuming you have the API helper functions set up
import { useNavigate } from 'react-router-dom';

const GoalPage = () => {
  const [goal, setGoalTitle] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [fetchedGoal, setFetchedGoal] = useState(null);
  const email = sessionStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      getGoal(email).then(response => {
        setFetchedGoal(response.goal);
      }).catch(error => {
        console.error("Error fetching goal:", error);
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

  const handleSubmitGoal = () => {
    //console.log(email);
    if (goal && tasks.length > 0) {
      setGoal({email: email, goal: goal, tasks: tasks })
        .then(() => {
          setFetchedGoal({ title: goal, activeTasks: tasks.map(t => ({ name: t, completed: false })) });
        })
        .catch(error => {
          console.error("Error setting goal:", error);
        });
    }
  };

  return (
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

      {fetchedGoal && (
        <Box mt={4}>
          <Typography variant="h5">Current Goal: {fetchedGoal.title}</Typography>
          <ul>
            {fetchedGoal.activeTasks.map((task, index) => (
              <li key={index}>{task.name} - {task.completed ? "Completed" : "Not Completed"}</li>
            ))}
          </ul>
        </Box>
      )}
    </Container>
  );
};

export default GoalPage;
