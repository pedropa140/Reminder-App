import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get all users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response;
}

// Create a user
export const createUser = async (user) => {
    const response = await axios.post(`${API_URL}/users/createUser`, user);
    return response;
}

// Get user based on email
export const getUser = async (email) => {
    const response = await axios.get(`${API_URL}/users/getUser/${email}`);
    return response;
}

// Set goal for user
export const setGoal = async (goal) => {
    console.log(goal);
    const response = await axios.put(`${API_URL}/users/setGoal`, goal);
    return response;
}

// Get goals for user
export const getGoals = async (email) => {
    const response = await axios.get(`${API_URL}/users/getGoals/${email}`);
    return response;
}

// Update task status
export const updateTaskStatus = async (email, goalTitle, taskName, completed) => {
    const response = await axios.put(`${API_URL}/users/updateTaskStatus`, {
        email,
        goalTitle,
        taskName,
        completed
    });
    return response;
};

// Update goal status
export const updateGoalStatus = async (email, goalTitle, completed) => {
    try {
        const response = await axios.put(`${API_URL}/users/updateGoalStatus`, {
            email,
            goalTitle,
            completed
        });
        return response.data;
    } catch (error) {
        console.error('Error updating goal status:', error);
        throw error;
    }
};


// Get completed goals for user
export const getCompletedGoals = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/getCompletedGoals/${email}`);
        return response;
    } catch (error) {
        console.error("Error in getCompletedGoals:", error);
        throw error;
    }
};


//get pair information for user
export const getPair = async(email) => {
    try {
        const response = await axios.get(`${API_URL}/users/getPair/${email}`);
        return response;
    } catch (error) {
        console.error("Error in getPair:", error);
        throw error;
    }
}

// set a pair information for user
export const setPair = async (email) => {
    const response = await axios.put(`${API_URL}/users/setPair`, { email });
    return response;
};

// Delete goal given email and goal time
export const deleteGoal = async (email, goalTitle) => {
    try {
      const response = await axios.delete(`${API_URL}/users/deleteGoal`, {
        data: { email, goalTitle }
      });
      return response;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };
  
  // delete task given email, goal, and task name
  export const deleteTask = async (email, goalTitle, taskName) => {
    try {
      const response = await axios.delete(`${API_URL}/users/deleteTask`, {
        data: { email, goalTitle, taskName }
      });
      return response;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };
  
  export const addReminder = async (email, month, day, year, reminder) => {
    try {
        const response = await axios.post(`${API_URL}/users/addReminder`, {
            email,
            month,
            day,
            year,
            reminder
        });
        return response.data;
    } catch (error) {
        console.error("Error adding reminder:", error);
        throw error;
    }
};

// Remove a reminder
export const removeReminder = async (email, month, day, year) => {
    try {
        const response = await axios.delete(`${API_URL}/users/removeReminder`, {
            data: { email, month, day, year }
        });
        return response.data;
    } catch (error) {
        console.error("Error removing reminder:", error);
        throw error;
    }
};

// Get all reminders for a user
export const getReminders = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/getReminders/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reminders:", error);
        throw error;
    }
};
