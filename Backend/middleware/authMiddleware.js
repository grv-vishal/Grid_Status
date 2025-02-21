const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const Operator = require('../Model/operatorModel');
require('dotenv').config()

const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            return res.status(401).json({message: "Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        let user
        if(decodedToken?.role==="user"){
            user = await User.findById(decodedToken?._id).select("-password")
        }
        else{
            user = await Operator.findById(decodedToken?._id).select("-password")
        }
    
        if (!user) {
            return res.status(401).json({message: "Invalid Access Token"})
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({message: "Invalid Access Token"})
    }
    
};

module.exports={
    verifyJWT
};