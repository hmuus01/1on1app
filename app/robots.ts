import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://1on1.fitness";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/coaches", "/gyms", "/gym-owners", "/how-it-works", "/pricing", "/auth/"],
        disallow: ["/dashboard/*", "/admin/*", "/api/*", "/onboarding", "/account", "/messages"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

