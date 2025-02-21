const mongoose = require('mongoose');

// Location Schema
const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensure no duplicate grid location names
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to User model
        }
    ],
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator' // Reference to Operator model
    },
    pv_Generation: {
      actual:[
        {
          time: { type: Number,required:true },
          actualValue: { type: Number,required:true}
        }

      ],
      forecast:[
        {
          time: { type: Number,required:true },
          forecastedValue: { type: Number,required:true}
        }
      ]                
    },
    wind_Generation: {
      actual:[
        {
          time: { type: Number,required:true },
          actualValue: { type: Number,required:true}
        }

      ],
      forecast:[
        {
          time: { type: Number,required:true },
          forecastedValue: { type: Number,required:true}
        }
      ]     
    },
    load_Value:[
      {
        hour:{type:String,required:true},
        total_Load:{type:Number,required:true},
        critical:{type:Number,required:true},
        non_Critical:{type:Number,required:true},
      }
    ],
    DR_Participants: [
      {
        timeSlot: { type: Number, required: true }, 
        participants: [
          {
            username: { type: String, required: true }, 
            response: { type: String, required: true } 
          }
        ]
      }
    ]
}, 
{
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Location', locationSchema);
