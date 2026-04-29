import mongoose from "mongoose"

const LeadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  serviceOffered: String,
  status: {
    type: String,
    enum: ["new", "contacted", "proposal_sent", "waiting", "closed_won", "closed_lost"],
    default: "new"
  },
  lastContactedAt: Date,
  nextFollowUpAt: { type: Date, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
})

LeadSchema.index({ userId: 1 })
LeadSchema.index({ nextFollowUpAt: 1 })

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema)