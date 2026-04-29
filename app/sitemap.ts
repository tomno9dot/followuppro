import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://followuppro.vercel.app",
      lastModified: new Date()
    },
    {
      url: "https://followuppro.vercel.app/signup",
      lastModified: new Date()
    },
    {
      url: "https://followuppro.vercel.app/login",
      lastModified: new Date()
    }
  ]
}