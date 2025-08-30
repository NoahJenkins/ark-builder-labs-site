import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  featured: boolean
  content: string
  slug: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        const { data, content } = matter(fileContents)

        return {
          id: slug,
          slug,
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          category: data.category || 'General',
          publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
          readTime: data.readTime || '5 min read',
          featured: data.featured || false,
          content,
        } as BlogPost
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return allPostsData
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id: slug,
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      category: data.category || 'General',
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      readTime: data.readTime || '5 min read',
      featured: data.featured || false,
      content,
    } as BlogPost
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

export function getBlogCategories(): string[] {
  const posts = getBlogPosts()
  const categories = ['All', ...new Set(posts.map(post => post.category))]
  return categories
}