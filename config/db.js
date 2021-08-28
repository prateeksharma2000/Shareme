require('dotenv').config();
const mongoose = require("mongoose");

function connectDB(){

    //Database Connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology:true
      } 
    )
    const connection = mongoose.connection;

    //when connection is open
    connection.once('open',()=>{
        console.log("Database Connected.");
    })
    connection.on('error', (err)=>{
        console.log("Error connecting to Database.");
    })
}

module.exports = connectDB;