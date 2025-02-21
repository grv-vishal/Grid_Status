const Location = require('../../Model/locationModel')
const csv = require('csv-parser');
const fs = require('fs');



const SaveLoadEnergy = async(req,res) => {

    try {
        // Check if a file is uploaded
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded!' });
        }

        //check for grid location 
        const gridLocation = req.params.location;
        const location = await Location.findOne({name:gridLocation});
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
    
        const results = [];
    
        // Read and parse the CSV file
        fs.createReadStream(file.path)
          .pipe(csv())
          .on('data', (row) => {
            const { Hour, Total_Load,Critical_Load,Non_CriticalLoad } = row;  // Adjust column names based on your CSV
            results.push({ 
                hour:Hour,
                total_Load:Total_Load,
                critical:Critical_Load,
                non_Critical:Non_CriticalLoad,
              });
          })
          .on('end', async () => {
            try {
              // Save each row to the database
              for (const row of results) {
                  const { hour,total_Load,critical,non_Critical} = row;
                  if (!hour || !total_Load || !critical || !non_Critical) {
                      return res.status(400).json({
                          success: false,
                          message: "All Data are required"
                      });
                  }
    
                  location.load_Value.push({
                    hour,
                    total_Load,
                    critical,
                    non_Critical
                  });
              }

              await location.save();
    
              res.status(200).json({
                  success: true,
                  message: "Load Data saved successfully",
                  data: results,
              });
            } 
            catch (error) {
              console.error(error);
              res.status(500).json({
                  success: false,
                  message: "Internal server error",
                  error: error.message,
              });
            }
          });
      
      } 
      catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the file', error: error.message });
      }
};




const GetLoadEnergy = async(req,res) => {
    try {
  
      const gridLocation = req.params.location;
      const location = await Location.findOne({name:gridLocation});
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
  
      // Fetch all data from the location document, sorted by time (most recent first)
      const response = location.load_Value;
  
      res.status(200).json({
        success: true,
        data: response,
        message: 'Data fetched successfully'
      });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch data',
        error: error.message
      });
    }
}


module.exports={
    SaveLoadEnergy,
    GetLoadEnergy,
}