const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    documents: [{ type: String, ref: 'Document' }]
})

const model = mongoose.model("user",UserSchema)

 module.exports = model