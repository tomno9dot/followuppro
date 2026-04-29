import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  type: { type: String, enum: ["ai", "manual"], default: "ai" },
  subject: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
})

MessageSchema.index({ userId: 1 })
MessageSchema.index({ leadId: 1 })

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)