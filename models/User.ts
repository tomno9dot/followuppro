import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  plan: { type: String, default: "free" },
  subscriptionStatus: { type: String, default: "trial" },
  trialEndsAt: Date,
  onboardingCompleted: { type: Boolean, default: false },
  aiGenerationsThisMonth: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  businessType: { type: String, default: "freelancer" }
})

export default mongoose.models.User || mongoose.model("User", UserSchema)