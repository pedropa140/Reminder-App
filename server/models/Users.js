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
        type: Boolean,
        default: false
    }

})

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel