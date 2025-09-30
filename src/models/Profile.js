import mongoose from "mongoose";

const DCEntrySchema=new mongoose.Schema({
    amount:{type:Number,required:true},
    date:{type:Date,required:true}
})

const ProfileSchema=new mongoose.Schema({
    name:{type:String,required:true},
    dcNo:{type:String,required:true,unique:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    loanAmount:{type:String,required:true},
    interest:{type:String,required:true},
    dcEntries: {
    type: [DCEntrySchema],
    default: []
  }
})
export default mongoose.model('Profile',ProfileSchema)