const Location = require('../../Model/locationModel')
const csv = require('csv-parser');
const fs = require('fs');



const SaveWindActualEnergy = async(req,res) => {

    try {
        // Check if a file is uploaded
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded!' });
        }

        //check for grid location 
        const gridLocation = req.params.location;
        const location = await Location.findOne({name:gridLocation});

        console.log(location);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
    
        const results = [];
    
        //Read and parse the CSV file
        fs.createReadStream(file.path)
          .pipe(csv())
          .on('data', (row) => {
            const { Hour,Wind_Actual } = row;  // Adjust column names based on your CSV
            results.push({ time:Hour, actualValue: Wind_Actual });
          })
          .on('end', async () => {
            try {
              // Save each row to the database
              for (const row of results) {
                  const { time, actualValue } = row;
                  if (!time || !actualValue) {
                      return res.status(400).json({
                          success: false,
                          message: "Both time and energyValue are required"
                      });
                  }
    
                  location.wind_Generation.actual.push({
                            time,
                            actualValue
                  });
              }

              await location.save();

              fs.unlink(file.path, (err) => {
                if (err) console.error(`Error deleting file: ${err}`);
              });
    
              res.status(200).json({
                  success: true,
                  message: "Data saved successfully",
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



const SaveWindPredictedEnergy = async(req,res) => {

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
            const { Hour, Wind_Predicted } = row;  // Adjust column names based on your CSV
            results.push({ time:Hour, forecastedValue:Wind_Predicted});
            //console.log(Hour,PV_Predicted)
          })
          .on('end', async () => {
            try {
              // Save each row to the database
              for (const row of results) {
                  const { time, forecastedValue } = row;
                  console.log(time,forecastedValue)
                  if (!time || !forecastedValue) {
                      return res.status(400).json({
                          success: false,
                          message: "Both time and energyValue are required"
                      });
                  }

                  location.wind_Generation.forecast.push({
                            time,
                           forecastedValue
                });
              }

              await location.save();
              fs.unlink(file.path, (err) => {
                if (err) console.error(`Error deleting file: ${err}`);
              });
    
              res.status(200).json({
                  success: true,
                  message: "Data saved successfully",
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


const GetWindActualEnergy = async(req,res) => {
  try {

    const gridLocation = req.params.location;
    const location = await Location.findOne({name:gridLocation});
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Fetch all data from the location document, sorted by time (most recent first)
    const response = location.wind_Generation.actual.sort((a, b) => a.time - b.time);

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



const GetWindPredictedEnergy = async(req,res) => {
  try {


    const gridLocation = req.params.location;
    const location = await Location.findOne({name:gridLocation});
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Fetch all data from the location document, sorted by time (most recent first)
    const response = location.wind_Generation.forecast.sort((a, b) => a.time - b.time);

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

module.exports = {
    SaveWindActualEnergy,
    SaveWindPredictedEnergy,
    GetWindActualEnergy,
    GetWindPredictedEnergy
}