import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Base URL
  const baseUrl = 'https://breakingbooks.in'

  // Fetch published courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)

  const courseEntries: MetadataRoute.Sitemap = (courses || []).map((course: any) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updated_at || course.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...courseEntries,
  ]
}
