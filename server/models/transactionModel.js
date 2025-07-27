import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  payment:{
    type: Boolean,
    default: false,
  },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });   
const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);
export default transactionModel;