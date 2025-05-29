import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    clerkId:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    photo:{type:String, required:true,},
    firstname:{type:String},
    lastname:{type:String}
})
const user=mongoose.models.usre || mongoose.model("user",userSchema);
export default user