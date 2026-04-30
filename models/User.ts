import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },

  subscriptionStatus: {
    type: String,
    enum: ["trial", "active", "expired"],
    default: "trial"
  },

  trialEndsAt: Date,

  aiGenerationsThisMonth: {
    type: Number,
    default: 0
  },
  lastResetMonth: {
  type: Number,
  default: new Date().getMonth()
},

  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.User ||
  mongoose.model("User", UserSchema)