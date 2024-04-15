const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
    _id:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:false,
    },
    data:{
        type:Object,
        require:true,
    },
    collaborators:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}]
})

 const model = mongoose.model("document",documentSchema)

 module.exports = model