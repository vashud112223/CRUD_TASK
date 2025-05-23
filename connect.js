const mongoose = require('mongoose');

const uri = "mongodb+srv://ashutoshverma557:g9xtIqIpiekO2GOF@cluster1.bdu7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
 const connectDB = () =>{
    console.log("connect db");
    return mongoose.connect(uri, {
        dbName: "Crud_Task",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
 };
 
 module.exports = connectDB;