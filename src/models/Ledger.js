import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema({
  dcNo: { type: String, required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Ledger",LedgerSchema)
