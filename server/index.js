require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const cors = require('cors');

app.use(express.json());
app.use(cors());

//backened Port + Mongodb conenction
const port = process.env.PORT 
const mongodb_url = process.env.MONGODB_URL;

mongoose.connect(
    mongodb_url
);
//gives us a list of all users
app.get("/users/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

//creates a new user
app.post("/users/createUser", async (req, res) => {  
    try {
      const user = req.body;
      //console.log(user);

      const newUser = new UserModel(user);
      await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({message: "Failed to create user", error: error });
    }
});


//get user based on email  (using this for all retrivals will probably make life easier)
app.get("/users/getUser/:email", async(req, res) => {
    try {
        const { email } = req.params;
        const user = await UserModel.findOne({ email });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to get user", error: error.message });
    }
});


//set a goal
app.put("/users/setGoal", async (req, res)=> {
    try{
        const { email, goal, tasks } = req.body;
        console.log(email);
        console.log(goal);
        console.log(tasks);
        const user = await UserModel.findOneAndUpdate(
            { email },
            { 
                activeGoal: {
                    title: goal,
                    completed: false,
                    activeTasks: tasks.map(task => ({ name: task, completed: false }))
                }
            },
            { new: true }
        );        if (user){
            res.status(200).json({message: "Goal updated successfully"});
        } else {
            res.status(404).json({ message: "User not found" });
        }


    }catch(error){
        res.status(500).json({ message: "Failed to update meeting attendance number", error: error.message });
    }
});

//get a goal
app.get("/users/getGoal/:email", async(req, res) => {
    try {
        const { email } = req.params;
        //console.log(email);
        const user = await UserModel.findOne({ email });
        if (user)
        {
            const activeGoal = user.activeGoal;
            res.status(200).json({activeGoal});
        } else {
            res.status(404).json({message: "User not found"});
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to get meeting reset number", error: error.message });
    }
})



app.listen(port, () => {
    console.log("SERVER RUNS")
});