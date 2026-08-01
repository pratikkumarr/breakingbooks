import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/courses', '/courses/*'],
      disallow: [
        '/admin',
        '/admin/*',
        '/dashboard',
        '/dashboard/*',
        '/login',
        '/signup',
        '/forgot-password',
        '/auth',
        '/auth/*'
      ],
    },
    sitemap: 'https://breakingbooks.in/sitemap.xml',
  }
}
