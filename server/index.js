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