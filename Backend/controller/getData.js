
const energyData =require('../Model/energyData');

exports.getData = async (req,res) =>{
    try {
        // Fetch all data from the database, sorted by time (most recent first)
        const response = await energyData.find().sort({ time: -1 });
    
        res.status(200).json({
          success: true,
          data: response,
          message: 'Data fetched successfully'
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch data',
          error: error.message
        });
      }
}