const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40
    },
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
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    activeGoal: [{
        title: {
            type: String,
            minlength: 1,
            maxlength: 40,
            default: "No Goal"
        },
        completed: {
            type: Boolean,
            default: false
        },
        activeTasks: [{
            name: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }]
    }],
    completedGoals: [
        {
            title: {
                type: String,
                minlength: 1,
                maxlength: 40,
                default: "No Goal"
            }
        }
    ],
    pair: {
        enable: {
        type: Boolean,
        default: false
        },
        partner: {
            type: String,
            default: "No Partner"
        }
    }

})

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel

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