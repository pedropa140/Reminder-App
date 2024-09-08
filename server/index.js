require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const TimerModel = require('./models/Timers');
app.use(express.json());
app.use(cors());

// Backend Port + MongoDB connection
const port = process.env.PORT || 5000;
const mongodb_url = process.env.MONGODB_URL;

mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gives us a list of all users
app.get("/users/getUsers", async (req, res) => {
    try {
        console.log('Fetching all users...');
        const users = await UserModel.find({});
        console.log('Users fetched:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error.message);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

// Creates a new user
app.post("/users/createUser", async (req, res) => {
    try {
        console.log('Creating new user with data:', req.body);
        const user = req.body;
        user.lastActivityDate = new Date(); // Set the last activity date to the current date
        const newUser = new UserModel(user);
        await newUser.save();
        console.log('User created:', user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Failed to create user:', error.message);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
});


// Get user based on email
app.get("/users/getUser/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching user with email:', email);
        const user = await UserModel.findOne({ email });

        if (user) {
            console.log('User found:', user);
            res.status(200).json(user);
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Failed to get user:', error.message);
        res.status(500).json({ message: "Failed to get user", error: error.message });
    }
});

// Get all goals for a user
app.get("/users/getGoals/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching goals for user with email:', email);
        const user = await UserModel.findOne({ email });

        if (user) {
            const activeGoals = user.activeGoal;
            console.log('Active goals:', activeGoals);
            res.status(200).json({ activeGoals });
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Failed to get goals:', error.message);
        res.status(500).json({ message: "Failed to get goals", error: error.message });
    }
});

// Set a goal
app.put("/users/setGoal", async (req, res) => {
    try {
        const { email, goal, tasks } = req.body;
        console.log('Setting new goal for user:', email);
        console.log('Goal data:', { goal, tasks });

        const newGoal = {
            title: goal,
            completed: false,
            activeTasks: tasks.map(task => ({ name: task, completed: false }))
        };

        console.log('Formatted Goal:', newGoal);

        const user = await UserModel.findOneAndUpdate(
            { email },
            { $push: { activeGoal: newGoal } },
            { new: true }
        );

        if (user) {
            console.log('Goal updated successfully:', user.activeGoal);
            res.status(200).json({ message: "Goal updated successfully", activeGoal: user.activeGoal });
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error updating goals:', error.message);
        res.status(500).json({ message: "Failed to update goals", error: error.message });
    }
});

// Update task status
app.put("/users/updateTaskStatus", async (req, res) => {
    try {
        const { email, goalTitle, taskName, completed } = req.body;

        const user = await UserModel.findOne({ email });

        if (user) {
            const goal = user.activeGoal.find(g => g.title === goalTitle);

            if (goal) {
                const task = goal.activeTasks.find(t => t.name === taskName);

                if (task) {
                    task.completed = completed;
                    await user.save();
                    res.status(200).json({ message: "Task status updated successfully" });
                } else {
                    res.status(404).json({ message: "Task not found" });
                }
            } else {
                res.status(404).json({ message: "Goal not found" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Failed to update task status", error: error.message });
    }
});

// Update goal status and move completed goals
app.put("/users/updateGoalStatus", async (req, res) => {
    try {
        const { email, goalTitle, completed } = req.body;

        // Update the goal's completed status
        const user = await UserModel.findOneAndUpdate(
            { email, "activeGoal.title": goalTitle },
            { $set: { "activeGoal.$.completed": completed } },
            { new: true }
        );

        if (user) {
            if (completed) {
                // Move completed goal to completedGoals
                await UserModel.findOneAndUpdate(
                    { email },
                    {
                        $pull: { activeGoal: { title: goalTitle } },
                        $push: { completedGoals: { title: goalTitle } }
                    },
                    { new: true }
                );
            }
            const updatedUser = await UserModel.findOne({ email });

            if (updatedUser.activeGoal.length === 0) {
                const partnerEmail = updatedUser.pair.partner;

                // No active goals left, disable pairing
                await UserModel.findOneAndUpdate(
                    { email },
                    { $set: { "pair.enable": false } },
                    { $set: { "pair.partner": "No Partner" }},
                    { new: true }
                );
                // Disable pairing for partner as well if they exist
                if (partnerEmail && partnerEmail !== "No Partner") {
                    await UserModel.findOneAndUpdate(
                        { email: partnerEmail },
                        {
                            $set: { "pair.enable": false },
                        },
                        {
                            $set: { "pair.partner": "No Partner" },
                        },
                        { new: true }
                    );
                }
            }
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User or goal not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update goal status", error: error.message });
    }
});

// Get all completed goals for a user
app.get("/users/getCompletedGoals/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching completed goals for user with email:', email);
        
        const user = await UserModel.findOne({ email });

        if (user) {
            console.log('Completed goals found:', user.completedGoals);
            res.status(200).json({ completedGoals: user.completedGoals });
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Failed to get completed goals:', error.message);
        res.status(500).json({ message: "Failed to get completed goals", error: error.message });
    }
});

// Get the pair JSON
app.get("/users/getPair/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching pair for user with email:', email);
        
        // Find the user based on the email
        const user = await UserModel.findOne({ email });

        // Check if the user has a partner
        if (user && user.pair.partner !== "No Partner") {
            const partnerEmail = user.pair.partner;
            
            // Find the partner's information
            const partner = await UserModel.findOne({ email: partnerEmail });

            if (partner) {
                console.log('Partner found:', partner);
                res.status(200).json({ partner: partner }); // Return partner's data
            } else {
                res.status(404).json({ message: "Partner not found" });
            }
        } else {
            res.status(404).json({ message: "User not paired or no partner available" });
        }
    } catch (error) {
        console.error('Failed to get pair:', error.message);
        res.status(500).json({ message: "Failed to get pair", error: error.message });
    }
});

// Pair users
app.put("/users/setPair", async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user who wants to pair and doesn't already have a partner
        const user = await UserModel.findOne({ email, 'pair.partner': "No Partner", 'activeGoal.0.completed': false });

        if (!user) {
            return res.status(404).json({ message: "User not found or already paired." });
        }

        // Find another user to pair with (who also hasn't been paired)
        const potentialPartner = await UserModel.findOne({
            email: { $ne: email },  // Ensure it's not the same user
            'pair.partner': "No Partner",
            'pair.enable' : false,
            'activeGoal.0.completed': false
        });

        if (!potentialPartner) {
            return res.status(404).json({ message: "No available partner found." });
        }

        // Pair both users
        user.pair.partner = potentialPartner.email;
        potentialPartner.pair.partner = user.email;
        user.pair.enable = true;
        potentialPartner.pair.enable = true;

        // Save both users
        await user.save();
        await potentialPartner.save();

        // Return the paired user's email
        res.status(200).json({ partner: potentialPartner });
    } catch (error) {
        res.status(500).json({ message: "Failed to pair users", error: error.message });
    }
});

// Delete a goal
app.delete('/users/deleteGoal', async (req, res) => {
    const { email, goalTitle } = req.body;
    try {
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $pull: { activeGoal: { title: goalTitle } } },
            { new: true }
        );
        if (user) {
            res.status(200).json({ message: "Goal deleted successfully", activeGoal: user.activeGoal });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
app.delete('/users/deleteTask', async (req, res) => {
    const { email, goalTitle, taskName } = req.body;
    try {
        const user = await UserModel.findOneAndUpdate(
            { email, 'activeGoal.title': goalTitle },
            { $pull: { 'activeGoal.$.activeTasks': { name: taskName } } },
            { new: true }
        );
        if (user) {
            res.status(200).json({ message: "Task deleted successfully", activeGoal: user.activeGoal });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all reminders for a user
app.get('/users/getReminders/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user and return their reminders
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(200).json({ reminders: user.reminders });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to get reminders", error: error.message });
    }
});

// Add a reminder
app.post('/users/addReminder', async (req, res) => {
    try {
        const { email, month, day, year, reminder } = req.body;

        // Ensure that month, day, and year are integers
        const parsedMonth = parseInt(month, 10);
        const parsedDay = parseInt(day, 10);
        const parsedYear = parseInt(year, 10);

        if (isNaN(parsedMonth) || isNaN(parsedDay) || isNaN(parsedYear)) {
            return res.status(400).json({ message: "Invalid date values" });
        }

        // Find the user and add the reminder
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $push: { reminders: { month: parsedMonth, day: parsedDay, year: parsedYear, reminder } } },
            { new: true }
        );

        if (user) {
            res.status(200).json({ message: "Reminder added successfully", reminders: user.reminders });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to add reminder", error: error.message });
    }
});

// Remove a reminder
app.delete('/users/removeReminder', async (req, res) => {
    try {
        const { email, month, day, year } = req.body;

        // Find the user and remove the reminder
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $pull: { reminders: { month, day, year } } },
            { new: true }
        );

        if (user) {
            res.status(200).json({ message: "Reminder removed successfully", reminders: user.reminders });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to remove reminder", error: error.message });
    }
});

// Update user information
app.put('/users/updateUserInfo', async (req, res) => {
    const { firstName, lastName, email, currentEmail, currentPassword, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ email: currentEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if currentPassword is provided and verify it
        if (currentPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            // Update the password if newPassword is provided
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
            }
        }

        // Update other user information
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user info", error: error.message });
    }
});


app.post("/gemini", async (req, res) => {
    const { history, message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const chat = model.startChat({
      history: req.body.history,
    });
    const msg = req.body.message;
  
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  });

  app.delete('/users/deleteUser', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await UserModel.findOneAndDelete({ email });
        if (result) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// POST route to handle user messages
app.post('/api/send-message', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    res.json({ responseText });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// POST route to regenerate a bot message
app.post('/api/regenerate', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    res.json({ responseText });
  } catch (error) {
    console.error('Error regenerating response:', error);
    res.status(500).json({ error: 'Failed to regenerate response' });
  }
});

app.delete('/timer/deleteTag', async (req, res) => {
    const {email, tagName} = req.body;

    try{
        const timer = await TimerModel.findOne({email});
        if (timer){
            timer.tags = timer.tags.filter(tag => tag !== tagName);
            await timer.save();
            res.status(200).json({message: "Tag deleted successfully"});
        }
        else {
            res.status(404).json({message: "User not found"});
        }
    }
    catch(error){
        res.status(500).json({message: "Error deleting tag", error: error.message});
    }
});

app.get("/users/getTags/:email", async (req, res) => {
    const {email} = req.params;
    try{
        const user = await TimerModel.findOne({ email });
        if (!user){
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json({tags:user.tags});
    }
    catch(error){
        console.error('Error fetching user tags:', error.message);
        res.status(500).json({message: "Error fetching user tags", error: error.message});
    }
});

app.post('/timer/addTag', async (req, res) => {
    const { email, newTag } = req.body;

    try {
        const timer = await TimerModel.findOne({ email });
        if (timer) {
            // Check if the tag already exists
            if (!timer.tags.includes(newTag)) {
                timer.tags.push(newTag);  // Add the new tag
                await timer.save();       // Save the updated document
                res.status(200).json({ message: "Tag added successfully" });
            } else {
                res.status(400).json({ message: "Tag already exists" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding tag", error: error.message });
    }
});

// Endpoint to retrieve streak and lastActivityDate by email
app.get("/users/streak", async (req, res) => {
    try {
        const email = req.query.email; // Get the email from the query parameter
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find the user by their email
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return streak and lastActivityDate
        res.status(200).json({
            streak: user.streak,
            lastActivityDate: user.lastActivityDate
        });
    } catch (error) {
        console.error("Error retrieving streak and lastActivityDate:", error);
        res.status(500).json({ message: "Failed to retrieve data", error: error.message });
    }
});

// Endpoint to modify streak and lastActivityDate by email
app.put("/users/streak", async (req, res) => {
    try {
        const { email, streak, lastActivityDate } = req.body;

        if (!email || streak === undefined || !lastActivityDate) {
            return res.status(400).json({ message: "Email, streak, and lastActivityDate are required" });
        }

        // Find the user and update their streak and lastActivityDate
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: email },
            { streak: streak, lastActivityDate: new Date(lastActivityDate) },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User streak and lastActivityDate updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating streak and lastActivityDate:", error);
        res.status(500).json({ message: "Failed to update data", error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


///generate flashcards using input
app.post('/api/generateFlashcards', async (req, res) => {
    const { prompt } = req.body;
    const systemPrompt = `
        You are a flashcard creator. Take in text and create exactly 10 flashcards from it.
        Each flashcard should have a front and back, both one sentence long.
        Return in the following JSON format:
        {
        "flashcards":[
            {
            "front": "Front of the card",
            "back": "Back of the card"
            }
        ]
        }
        `
    
    try {
      const result = await model.generateContent(systemPrompt+ prompt);
      const response = await result.response;
      const responseText = response.text();
      const flashcards = JSON.parse(response.text())

  
      res.json({ flashcards });
    } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });
  