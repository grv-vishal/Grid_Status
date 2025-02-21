const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
require('dotenv').config()

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gridLocation: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location', // Reference to Location model 
        required: true 
    },
    energyConsumption: { 
        type: Number, 
        default: 0 // Default energy consumption if none is provided
    },
    role: {
        type: String,
        enum: ['User'], // Ensures only "User" role can be assigned in this schema
        default: 'User'
    },
    DR_participation:[
        {
            timeSlot:{type:Number,required:true},
            response:{type:String,required:true},
            incentive:{type:Number,required:true}
        }
    ],
    refreshToken:{
        type: String
    }
}, {
    timestamps: true
});


// Password hashing middleware before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.generateAccessToken =function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role: 'user'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

module.exports = mongoose.model('User', userSchema);
