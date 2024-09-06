require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const cors = require('cors');

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

//get the pair json
app.get("/users/getPair/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching pair for user with email:', email);
        
        const user = await UserModel.findOne({ email });

        if (user) {
            console.log('Pair found:', user.pair);
            res.status(200).json({ pair: user.pair });
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
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
            'activeGoal.0.completed': false
        });

        if (!potentialPartner) {
            return res.status(404).json({ message: "No available partner found." });
        }

        // Pair both users
        user.pair.partner = potentialPartner.email;
        potentialPartner.pair.partner = user.email;

        // Save both users
        await user.save();
        await potentialPartner.save();

        // Return the paired user's email
        res.status(200).json({ message: "Paired successfully", partner: potentialPartner.email });
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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
