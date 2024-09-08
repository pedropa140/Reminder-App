const mongoose = require('mongoose');
const TimerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email.`
        }
    },
    tags: {
        type: [String], // An array of tags (strings)
        default: []     // Default to an empty array
    },
    pomodoroSessions: [
        {
            date: {type: Date, required:true}, //report the current day of the pom. 
            duration: { type: Number, required: true },
            tagName:{type:String, required: true}, //cleaning (50 minutes), studying (25 minutes), coding (100 minutes), Unlisted (25 minutes)
            pomQuality: { type: Number, required: false} // Store duration in minutes or seconds
        }
    ]
});

const TimerModel = mongoose.model("Timer", TimerSchema);
module.exports = TimerModel;