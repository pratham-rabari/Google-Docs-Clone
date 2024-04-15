const mongoose = require("mongoose");

const connect = async()=>{
    const password = `user1`
    const url = `mongodb+srv://user1:${password}@cluster0.hcrw9rc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    try{
    await mongoose.connect(url)
    console.log("db connect successfully")
    }catch(error){
        console.log(error)
    }
}

module.exports = {connect};
