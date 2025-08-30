# Blog Posts

This directory contains MDX blog posts for the Ark Builder Labs website.

## Creating a New Blog Post

1. Create a new `.mdx` file in this directory
2. Add the required frontmatter at the top of the file:

```yaml
---
title: "Your Post Title"
excerpt: "A brief description of your post"
category: "Web Development" # or "Cloud Engineering", "AI Consulting", etc.
publishedAt: "2024-08-30" # YYYY-MM-DD format
readTime: "5 min read"
featured: false # Set to true to feature on the blog homepage
image: "/images/blog/your-image.jpg" # Optional: path to blog post image
---
```

3. Write your content using Markdown/MDX syntax
4. The blog system will automatically:
   - Generate the URL based on the filename (e.g., `my-post.mdx` → `/blog/my-post`)
   - Display the post on the blog listing page
   - Handle proper SEO metadata

## Supported Frontmatter Fields

- `title` (required): The post title
- `excerpt` (required): Brief description for the blog listing
- `category` (required): Post category for filtering
- `publishedAt` (required): Publication date in YYYY-MM-DD format
- `readTime` (optional): Estimated reading time, defaults to "5 min read"
- `featured` (optional): Whether to feature the post, defaults to false
- `image` (optional): Path to blog post image, replaces emoji placeholder

## MDX Features

You can use all standard Markdown syntax plus React components. The system includes custom styling for:

- Headings (h1, h2, h3)
- Paragraphs and lists
- Code blocks and inline code
- Blockquotes
- Links

## Example Post Structure

```mdx
---
title: "Getting Started with Next.js 15"
excerpt: "Learn about the latest features in Next.js 15 and how to upgrade your applications."
category: "Web Development"
publishedAt: "2024-08-30"
readTime: "8 min read"
featured: true
image: "/assets/images/blog/nextjs-15-guide.jpg"
---

# Getting Started with Next.js 15

Next.js 15 introduces several exciting features...

## New Features

- Feature 1
- Feature 2

## Code Example

\`\`\`typescript
const example = "Hello World"
\`\`\`

[Learn more](https://nextjs.org)
```

## Adding Images to Blog Posts

### Method 1: Frontmatter Image (Recommended)

Add an `image` field to your post's frontmatter:

```yaml
---
title: "My Blog Post"
image: "/assets/images/blog/my-post-hero.jpg"
---
```

**Image Requirements:**
- Place images in `/public/assets/images/blog/` directory
- Recommended size: 1200x630px (16:9 aspect ratio)
- Supported formats: JPG, PNG, WebP
- File size: Keep under 500KB for best performance

### Method 2: Images Within Content

You can also add images directly in your MDX content:

```mdx
![Alt text](/assets/images/blog/content-image.jpg)

# Or using Next.js Image component
import Image from 'next/image'

<Image 
  src="/assets/images/blog/content-image.jpg" 
  alt="Description" 
  width={600} 
  height={400} 
/>
```

### Image Organization

```
public/
  assets/
    images/
      blog/
        welcome-to-our-blog.png              # Featured image for welcome post
        nextjs-performance-optimization.png  # Featured image for Next.js post
        cloud-infrastructure-best-practices.png # Featured image for cloud post
        ai-integration-practical-guide.png   # Featured image for AI post
        content/
          diagram-1.jpg                      # Images used within post content
          screenshot-2.png                   # Screenshots or other content images
```