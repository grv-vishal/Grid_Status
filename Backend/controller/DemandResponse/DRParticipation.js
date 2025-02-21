const Location=require('../../Model/locationModel')
const User=require('../../Model/userModel')

const { updateDRParticipants } = require('../../utils/updateDrParticipants')


const SaveUserDR= async(req,res) =>{
    try{

        const gridLocation=req.params.location;
        const userId=req.params.user;
        const {timeSlot,responseMethod,incentive}=req.body;

        if(!timeSlot || !responseMethod || !incentive){
            return res.status(400).json({ message: 'No schedule Data Available!' });
        }

        const location= await Location.findOne({name:gridLocation});
        if (!location) {
            return res.status(404).json({ message: `Location not found ` });
        }

        const user = await User.findOne({ username: userId, gridLocation: location._id });
        if (!user) {
          return res.status(404).json({ message: `User not found for this location ${gridLocation} ${userId}` });
        }

        user.DR_participation.push({
            timeSlot,
            response: responseMethod,
            incentive,
        });

        await user.save();


        await updateDRParticipants(location._id);

       // Send success response
       res.status(200).json({
        message: 'Demand Response participation saved successfully',
        data: user.DR_participation, // Optional: return the updated DR_participation array
       });
    }
    catch(error) {
      console.error('Error in SaveUserDR:', error.message);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
}

const GetUserDR = async(req,res) => {
    try{

        const gridLocation=req.params.location;
        const userId=req.params.user;
        
        const location= await Location.findOne({name:gridLocation});
        if (!location) {
            return res.status(404).json({ message: `Location not found ` });
        }

        const user = await User.findOne({ username: userId, gridLocation: location._id });
        if (!user) {
          return res.status(404).json({ message: `User not found for this location ${gridLocation} ${userId}` });
        }

        const response = user.DR_participation.sort((a,b)=>a.timeSlot-b.timeSlot);

       // Send success response
       res.status(200).json({
        success:true,
        message: 'Demand Response participation data fetched successfully',
        data: response, // return the response
       });
    }
    catch(error) {
      res.status(500).json({
        success:false,
        message: 'failed to fetch User DR data',
        error: error.message,
      });
    }
}


const GetTotalDrParticipants = async(req,res) =>{
    try{

      const gridLocation=req.params.location;

      const location= await Location.findOne({name:gridLocation});
      if (!location) {
          return res.status(404).json({ message: `Location not found ` });
      }

      const response = location.DR_Participants.sort((a,b)=>a.timeSlot-b.timeSlot);
      
      res.status(200).json({
        success:true,
        message: 'Total DR Participants data fetched successfully',
        data: response, // return the response
       });

  }
  catch(error){
    res.status(500).json({
      success:false,
      message: 'failed to fetch User DR Participants data',
      error: error.message,
    });
  }

}

module.exports={
    SaveUserDR,
    GetUserDR,
    GetTotalDrParticipants
}