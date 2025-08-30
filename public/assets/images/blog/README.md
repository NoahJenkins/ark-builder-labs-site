# Blog Images Directory

Place your blog post featured images in this directory.

## Current Image Requirements:

The blog posts are expecting these images:

- `welcome-to-our-blog.png` - Featured image for the welcome post
- `nextjs-performance-optimization.png` - Featured image for Next.js optimization post  
- `cloud-infrastructure-best-practices.png` - Featured image for cloud infrastructure post
- `ai-integration-practical-guide.png` - Featured image for AI integration post

## Image Specifications:

- **Size**: 1200x630px (16:9 aspect ratio recommended)
- **Format**: PNG, JPG, or WebP
- **File size**: Keep under 500KB for optimal performance
- **Quality**: Use high-quality images that represent the content well

## Usage in Blog Posts:

Reference images in your blog post frontmatter like this:

```yaml
---
title: "Your Post Title"
image: "/assets/images/blog/your-image-name.png"
---
```

## Fallback Behavior:

If an image is missing, the system will show emoji placeholders:
- 📝 for featured posts
- 📄 for regular posts

This ensures your blog always looks good even without images.