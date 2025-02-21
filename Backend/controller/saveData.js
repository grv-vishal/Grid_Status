
const energyData =require('../Model/energyData');
const csv = require('csv-parser');
const moment=require('moment')
const fs = require('fs');

exports.saveData = async (req,res) => {
  //  try{
  //      console.log('Request received:', req.body);

  //      const {time,energyValue} =req.body;

  //      // Basic validation
  //      if (!time || !energyValue) {
  //       return res.status(400).json({
  //           success: false,
  //           message: 'Both time and energyValue are required'
  //       });
  //     }

  //      const response=await energyData.create({time,energyValue});
  //      res.status(200).json(
  //        {
  //          success:true,
  //          data:response,
  //          message:'Entery succussfull'
  //        });
  //  }
  //  catch(error){
  //   console.error(error);
  //   console.log(error);
  //   res.status(500)
  //   .json({
  //       success:false,
  //       data:"internal server error",
  //       message:error.message,
  //   })
  //  }



  try {
    // Check if a file is uploaded
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    const results = [];

    // Read and parse the CSV file
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        const { Time, Wind_Power } = row;  // Adjust column names based on your CSV
        results.push({ time:Time, energyValue: Wind_Power });
      })
      .on('end', async () => {
        try {
          // Save each row to the database
          for (const row of results) {
              const { time, energyValue } = row;
              if (!time || !energyValue) {
                  return res.status(400).json({
                      success: false,
                      message: "Both time and energyValue are required"
                  });
              }

              // Parse the time in the format YYYYMMDD:HHMM
              const parsedTime = moment(time, 'YYYYMMDD:HHmm').toISOString();
              if (!parsedTime) {
                  return res.status(400).json({
                      success: false,
                      message: "Invalid time format"
                  });
              }

              await energyData.create({ time: parsedTime, energyValue });
          }

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
