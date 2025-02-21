const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
require('dotenv').config()


// Operator Schema
const operatorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    gridLocation: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location', // Reference to Location model
        required: true
    },
    role: {
        type: String,
        enum: ['Operator'], // Ensures only "Operator" role is assigned in this schema
        default: 'Operator'
    },
    refreshToken:{
        type: String
    }
}, {
    timestamps: true
});


// Password hashing middleware before saving the operator
operatorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


operatorSchema.methods.generateAccessToken =function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role: 'operator'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

operatorSchema.methods.generateRefreshToken = function(){
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

module.exports = mongoose.model('Operator', operatorSchema);
