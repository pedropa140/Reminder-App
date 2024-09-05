import axios from 'axios';
const API_URL = 'http://localhost:5000';

//get all Users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response;
}

//create a User
export const createUser = async (user) => {
    const response = await axios.post(`${API_URL}/users/createUser`, user);
    return response;
}

//get user based on email
export const getUser = async (email) => {
    const response = await axios.get(`${API_URL}/users/getUser/${email}`);
    return response;
}

//set goal for user
export const setGoal = async (goal) => {
    console.log(goal);
    const response = await axios.put(`${API_URL}/users/setGoal`, goal);
    return response;
}

//get goal for user (fetches a single goal)
export const getGoal = async (email) => {
    const response = await axios.get(`${API_URL}/users/getGoal/${email}`);
    return response;
}

//get all goals for user (fetches all goals)
export const getGoals = async (email) => {
    const response = await axios.get(`${API_URL}/users/getGoals/${email}`);
    return response;
}

export const updateTaskStatus = (email, goalTitle, taskName, completed) => {
    return axios.put(`${API_URL}/users/updateTaskStatus`, {
        email,
        goalTitle,
        taskName,
        completed
    });
};

// api.js
export const updateGoalStatus = (email, goalTitle, completed) => {
    return fetch(`http://localhost:5000/users/updateGoalStatus`, { // Adjust the URL as needed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, goalTitle, completed })
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error updating goal status:', error);
    });
  };
  