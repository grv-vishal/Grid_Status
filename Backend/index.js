const express=require("express")
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const app=express()
const port=process.env.PORT || 5000

// Enable CORS for all origins or specify particular origins
app.use(cors({
    origin: '*',  // Allow requests from this origin
    credentials: true,
    origin:true
}));


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


//routes
// const dataRoute=require('./routes/data')
// app.use('/api',dataRoute)



const authRoute=require('./routes/authRoute')
const energyRoute=require('./routes/energyRoute')
const drRoute=require('./routes/drRoute');
app.use('/api/auth',authRoute)
app.use('/api/energy',energyRoute)
app.use('/api/demand-response',drRoute)



app.use((req, res, next) => {
    console.log(`Received ${req.method} request for '${req.url}'`);
    next();
});


//app listen
app.listen(port,()=>{
    console.log(`Server started Successfully on ${port}`)
})


//DB connection
const dbconnect =require('./config/database')
dbconnect();


app.get("/",(req,res) =>{
    res.send("My new Server")
})


