import { RateLimiterMemory } from "rate-limiter-flexible"

export const aiLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60 // per 60 seconds
})