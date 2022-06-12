const mongoose=require("mongoose")
const signupSchema= new mongoose.Schema({
    name:String,
    mobile:Number,
    email:String,
    password:String
})
module.exports=mongoose.model('user',signupSchema)