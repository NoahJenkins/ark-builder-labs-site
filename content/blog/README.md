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