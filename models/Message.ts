import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  subject: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)