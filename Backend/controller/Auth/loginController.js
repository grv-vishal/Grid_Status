const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../Model/userModel');
const Operator = require('../../Model/operatorModel');
const Location = require('../../Model/locationModel');
require('dotenv').config()

//generating both access and resfresh Token
const generateAccessAndRefereshTokens = async(userId,role) => {
    try {
        let user;

        if(role==='user'){
            user = await User.findById(userId)
        }
        else{
            user = await Operator.findById(userId)
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log(accessToken);
        console.log(refreshToken);
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        return (error.message || "Something went wrong while generating referesh and access token")
    }
}



//user/operator login
const Login = async (req, res) => {
    const { username, password, role, location } = req.body;
    
    console.log('Login request received');
    console.log(`Username: ${username}, Password: ${password}, Location: ${location}, Role: ${role}`);

    try {
        
        // Find the location document first by name
        const gridLocation = await Location.findOne({ name: location });
        if (!gridLocation) {
            return res.status(400).json({ message: 'Location not found' });
        }


        // Choose the model based on the role
        let user;
        if (role === 'user') {
            user = await User.findOne({ username, gridLocation: gridLocation._id });
        } else if (role === 'operator') {
            user = await Operator.findOne({ username, gridLocation: gridLocation._id });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // If the user or operator does not exist
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token (optional)
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id,role)
        
        const options={
            httpOnly:true,
            secure: 'false', 
            sameSite: 'Lax',
            maxAge: 3600000,
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                 username: user.username, 
                 role: user.role, 
                 location: location }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



//logout
const Logout = async(req,res) =>{
    
   if(req.user.role==='user'){
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
   }
   else{
    await Operator.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
   }

    const options = {
        httpOnly: true,
        secure: 'false', 
        sameSite:"Lax",
    }


    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({message: "User logged Out"})
};



//refresh access Token
const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json("Unauhorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        let user
        if(decodedToken?.role==="user"){
            user = await User.findById(decodedToken?._id)
        }
        else{
            user = await Operator.findById(decodedToken?._id)
        }
    
        if (!user) {
            return res.status(401).json("Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json("refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: false,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id,user.role)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            message:"Access token refreshed",
            accessToken,
            refreshToken: newRefreshToken,
        })

    } catch (error) {
        return res.status(401).json( error?.message || "Invalid refresh token")
    }

}




module.exports = {
   Login,
   Logout,
   refreshAccessToken,
};

