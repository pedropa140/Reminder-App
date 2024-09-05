require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Backend Port + MongoDB connection
const port = process.env.PORT;
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
            const activeGoals = user.activeGoal; // Assuming `activeGoal` is an array now
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

        // Construct the goal object
        const newGoal = {
            title: goal,
            completed: false,
            activeTasks: tasks.map(task => ({ name: task, completed: false }))
        };

        console.log('Formatted Goal:', newGoal);

        // Push the new goal into the user's activeGoal array
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $push: { activeGoal: newGoal } }, // Add the new goal
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

// Get a goal for a user
app.get("/users/getGoal/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching goal for user with email:', email);
        const user = await UserModel.findOne({ email });

        if (user) {
            const activeGoal = user.activeGoal;
            console.log('Active goal:', activeGoal);
            res.status(200).json({ activeGoal });
        } else {
            console.log('User not found for email:', email);
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Failed to get goal:', error.message);
        res.status(500).json({ message: "Failed to get goal", error: error.message });
    }
});

// backend/server.js

app.put("/users/updateTaskStatus", async (req, res) => {
    try {
        const { email, goalTitle, taskName, completed } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (user) {
            // Find the specific goal
            const goal = user.activeGoal.find(g => g.title === goalTitle);

            if (goal) {
                // Find the specific task within the goal
                const task = goal.activeTasks.find(t => t.name === taskName);

                if (task) {
                    // Update the task completion status
                    task.completed = completed;

                    // Save the user document with the updated task
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

app.get("/testUpdateTask", async (req, res) => {
    try {
        const email = 'test@example.com'; // Replace with a real email for testing
        const goalTitle = 'Test Goal';
        const taskName = 'Test Task';
        const completed = true;

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

// Assuming you have already required necessary modules and set up mongoose

app.put("/users/updateGoalStatus", async (req, res) => {
    try {
      const { email, goalTitle, completed } = req.body;
  
      // Find the user and update the goal status
      const user = await UserModel.findOneAndUpdate(
        { email, "activeGoal.title": goalTitle },
        { $set: { "activeGoal.$.completed": completed } },
        { new: true }
      );
  
      if (user) {
        // Move the completed goal to completedGoals if completed
        if (completed) {
          const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
              $pull: { activeGoal: { title: goalTitle } },
              $push: { completedGoals: { title: goalTitle } }
            },
            { new: true }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(200).json(user);
        }
      } else {
        res.status(404).json({ message: "User or goal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal status", error: error.message });
    }
  });
  

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
