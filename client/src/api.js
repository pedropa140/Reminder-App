import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get all users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response;
}

// Create a user
export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/createUser`, userData);
        return response;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

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

// Get pair information for user
export const getPair = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/getPair/${email}`);
        return response;
    } catch (error) {
        console.error("Error in getPair:", error);
        throw error;
    }
}

// Set pair information for user
export const setPair = async (email) => {
    const response = await axios.put(`${API_URL}/users/setPair`, { email });
    return response;
};

// Delete goal given email and goal title
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

// Delete task given email, goal, and task name
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

// Add a reminder
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

// api.js

// Send message to Gemini AI
export const sendMessageToGemini = async (history, message) => {
    try {
        const response = await fetch(`${API_URL}/gemini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history, message }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error sending message to Gemini:', error);
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

// Update user information
export const updateUserInfo = async (userData) => {
    try {
        const response = await axios.put(`${API_URL}/users/updateUserInfo`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
};

export const deleteUser = async (email) => {
    try {
        const response = await axios.delete(`${API_URL}/users/deleteUser`, {
            data: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
const formatResponseText = (text) => {
    return text
        .replace(/^# (.*?)$/gm, "<h1>$1</h1>")                // Convert '# Heading' to <h1>
        .replace(/^## (.*?)$/gm, "<h2>$1</h2>")               // Convert '## Heading' to <h2>
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")                // Bold formatting
        .replace(/^\* (.*?)$/gm, "<li>$1</li>")                // Convert '* item' to list item
        .replace(/<\/li>\s*<li>/g, "</li><li>")                // Properly close list items
        .replace(/<\/li>\s*$/g, "</li>")                       // Close last list item
        .replace(/^(<li>.*<\/li>\s*)+$/gm, "<ul>$&</ul>")      // Wrap multiple list items in <ul> tags
        .replace(/\n/g, "<br>");                               // Replace newlines with <br> tags
};

/**
 * Sends a message to the backend to generate a chatbot response.
 * @param {string} prompt - The user's input prompt for the chatbot.
 * @returns {Promise<string>} - The chatbot's response.
 */
export const sendMessage = async (prompt) => {
    try {
        const response = await fetch(`${API_URL}/api/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        const formattedResponse = formatResponseText(data.responseText); // Apply formatting

        return formattedResponse;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Regenerates the chatbot's response for a previous user message.
 * @param {string} prompt - The user's input prompt for which to regenerate the response.
 * @returns {Promise<string>} - The chatbot's regenerated response.
 */
export const regenerateMessage = async (prompt) => {
    try {
        const response = await fetch(`${API_URL}/api/regenerate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error('Failed to regenerate message');
        }

        const data = await response.json();
        const formattedResponse = formatResponseText(data.responseText); // Apply formatting

        return formattedResponse;
    } catch (error) {
        console.error('Error regenerating message:', error);
        throw error;
    }
};
//delete a tag
//get all the tags
//supposedly no set tag.
export const deleteTag = async (email, tagName) => {
    try {
        const response = await axios.delete(`${API_URL}/timers/deleteTag`, {
            data: { email, tagName }
        });
        console.log('Delete response:', response.data); // Log response
        return response.data
    }
    catch (error) {
        console.error('Error in deleting tag:', error);
        throw error;
    }
};

export const getAllTags = async (email) => {
    console.log(`Fetching tags for email: ${email}`);
    try {
        const response = await axios.get(`${API_URL}/timers/getTags/${email}`);
        return response.data.tags; //just the tags
    }
    catch (error) {
        console.error("Error in retrieving tags:", error);
        throw error;
    }
};

export const addTag = async (email, newTag) => {
    try {
        const response = await axios.post(`${API_URL}/timers/addTag`, { email, newTag: newTag.trim() });
        return response.data;
    } catch (error) {
        console.error('Error in adding tag:', error);
        throw error;
    }
};

export const getStreakAndLastActivity = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/streak`, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error retrieving streak and lastActivityDate:', error);
        throw error;
    }
};

// Update streak and lastActivityDate
export const updateStreakAndLastActivity = async (email, streak, lastActivityDate) => {
    try {
        const response = await axios.put(`${API_URL}/users/streak`, {
            email,
            streak,
            lastActivityDate
        });
        return response.data;
    } catch (error) {
        console.error('Error updating streak and lastActivityDate:', error);
        throw error;
    }
};

// export const handleAddTag = async (email, newTag) => {
//     if (!newTag || newTag.trim() === '') {
//         console.error('Tag cannot be empty');
//         return;
//     }

//     try {
//         await addTag(email, newTag.trim());  // Ensure newTag is trimmed before sending
//         setNewTag('');  // Clear the input field after adding the tag
//     } catch (error) {
//         console.error('Error adding tag:', error);
//     }
// };

//geenrating flashcards
export const generateFlashcards = async (prompt) => {
    try {
      const response = await fetch(`${API_URL}/api/generateFlashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      const formattedResponse = formatResponseText(data.flashcards); // Apply formatting
  
      return formattedResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
  export const sendFeedback = async (name, email, message) => {
    try {
      const response = await fetch('http://localhost:5000/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  