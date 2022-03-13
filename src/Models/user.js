const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    customTimesId: {type: Number,
                    default: 0,
                    unique: false},
    custom_times:{type: Array
    },
    hydration:{
        on:{
            type: Boolean,
            default: false},
        time:{
            hours:
                {type: Number,
                 default: 0},
            minutes:
                {type: Number,
                 default: 0}
        },
        water:{
            quantity:{
                type: Number,
                default: 0
            },
            measure:{
                type: String,
                enum: ["ml", "L"],
                default: "ml"
            }},
        nextWarning:{
            type: Date,
            default: null
        }
    }
});

module.exports = mongoose.model('User', UserSchema);