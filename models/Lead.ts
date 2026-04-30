import mongoose from "mongoose"

const LeadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  serviceOffered: String,
  status: {
    type: String,
    enum: ["new", "contacted", "proposal_sent", "closed_won", "closed_lost"],
    default: "new"
  },
  dealValue: {
  type: Number,
  default: 0
},
  nextFollowUpAt: Date,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema)