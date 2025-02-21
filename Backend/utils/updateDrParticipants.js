const Location = require('../Model/locationModel')
const User = require('../Model/userModel')



const updateDRParticipants = async (locationId) => {
    try {
      // Step 1: Fetch all users for the given location
      const users = await User.find({ gridLocation: locationId });
  
      if (!users.length) {
        console.log('No users found for the specified location.');
        return;
      }
  
      // Step 2: Extract DR Participation data with usernames
      const drParticipation = users.flatMap(user =>
        user.DR_participation.map(participation => ({
          timeSlot: participation.timeSlot,
          username: user.username,
          response: participation.response
        }))
      );
  
      // Step 3: Aggregate data by timeSlot
      const drSummary = drParticipation.reduce((acc, { timeSlot, username, response }) => {
        // Find or create an entry for the timeSlot
        let timeSlotEntry = acc.find(entry => entry.timeSlot === timeSlot);
        if (!timeSlotEntry) {
          timeSlotEntry = { timeSlot, participants: [] };
          acc.push(timeSlotEntry);
        }
  
        // Add the username and response to the participants array
        timeSlotEntry.participants.push({ username, response });
  
        return acc;
      }, []);
  
      // Step 4: Update the drParticipationSummary field in the Location model
      await Location.findByIdAndUpdate(
        locationId,
        { DR_Participants: drSummary },
        { new: true } // Return the updated document
      );
  
      console.log('DR Participation Summary updated successfully for location:', locationId);
    } catch (error) {
      console.error('Error updating DR Participation Summary:', error.message);
    }
  };
  
  module.exports = { updateDRParticipants };