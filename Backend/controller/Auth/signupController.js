const Location = require('../../Model/locationModel');
const User = require('../../Model/userModel');
const Operator = require('../../Model/operatorModel');


const UserSignup = async (req, res) => {
    
    try {
        const { name, username, email, password, gridLocation } = req.body;

        // Validate that all fields are provided
        if (!name || !username || !email || !password || !gridLocation) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists." });
        }

        
        // Check if the location exists
        let location = await Location.findOne({ name: gridLocation });
        if (!location) {
            return res.status(404).json({ message: 'No Grid Working in this Location' });
        }

        // Create a new user
        const newUser = await User.create({
            name,
            username,
            email,
            password, // Password will be hashed in the model
            gridLocation: location._id, 
        });

        // Add user ID to the location's users array
        location.users.push(newUser._id);
        await location.save();

        return res.status(201).json({ 
            message: 'User created successfully', 
            user: {
                name:newUser.name,
                username:newUser.username,
                email:newUser.email,
                gridLocation:gridLocation
            } 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating user', error });
    }
};


const OperatorSignup = async (req, res) => {
    try {
        
        const { name, username, password, gridLocation } = req.body;
    
        // Validate that all fields are provided
        if (!name || !username || !password || !gridLocation) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the username already exists
        const existingOperator = await Operator.findOne({ username });
        if (existingOperator) {
            return res.status(400).json({ message: "Operator already exists." });
        }

        // Check if the location exists
        let location = await Location.findOne({ name: gridLocation });
        if (!location) {
            location= await Location.create({name:gridLocation});
        }

        // Create a new Operator
        const newOperator = await Operator.create({
            name,
            username,
            password, // Password will be hashed in the model
            gridLocation: location._id, 
        });

        // Assign the operator to the location
        location.operator = newOperator._id;
        await location.save();

        return res.status(201).json({ 
            message: 'Operator created successfully', 
            operator:{
                name:newOperator.name,
                username:newOperator.username,
                gridLocation:gridLocation
            } 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating operator', error });
    }
};


module.exports= {
    UserSignup,
    OperatorSignup
};

