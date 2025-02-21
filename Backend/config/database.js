const mongoose = require('mongoose')

require('dotenv').config()

const dbconnect = async () => {
    try{
      await mongoose.connect(process.env.DB_URL);
      console.log("DB Connection Successfull");
   }
   catch(error){
        console.log("DB Connnection issues");
        console.log(error);
        process.exit(1);
    };
};

module.exports=dbconnect;