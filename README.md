# Ark Builder Labs Website

A modern, professional company website built with Next.js 15, featuring bold animations, dark mode support, comprehensive business pages, and a complete MDX-powered blog system.

## 🚀 Features

- **Modern Design System**: Professional UI with gradient themes and smooth animations
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach ensuring great UX across all devices
- **Animation Library**: Smooth page transitions and micro-interactions using Framer Motion
- **SEO Optimized**: Meta tags, structured data, and performance optimizations
- **Contact Integration**: Working contact forms with API routes (ready for email service integration)
- **Service Pages**: Dynamic routing for individual service offerings
- **Blog System**: Full MDX-powered blog with frontmatter support, categories, and featured posts
- **Partnership Showcase**: Professional certifications and technology partner displays
- **Calendar Integration**: Cal.com integration placeholder for consultation booking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Theme**: next-themes
- **UI Components**: Custom component library with CVA (Class Variance Authority)
- **Blog**: MDX with gray-matter for frontmatter parsing
- **Content Management**: File-based MDX content system

## 📋 Pages & Features

- **Homepage**: Hero section, services overview, stats, and CTA
- **About**: Company story, mission, values, and approach
- **Services**: Main services page with detailed individual service pages
  - Web & Mobile Development
  - Cloud Engineering & Consulting
  - AI Technology Consulting
- **Partnerships**: Technology partners and professional certifications
- **Blog**: Full MDX blog system with categories, featured posts, and dynamic routing
- **Contact**: Contact form, FAQ, and calendar integration placeholder

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#2B5797)
- **Accent**: Lighter Blue (#4A7CC7)
- **Dark Mode**: Deep Navy (#0A1628) backgrounds
- **Success**: Teal (#06D6A0)
- **Warning**: Amber (#FFB700)

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (content)
- **Code Font**: JetBrains Mono (technical content)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager
- Git

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ark-builder-labs-site.git
   cd ark-builder-labs-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   CONTACT_EMAIL=your-email@example.com
   CALCOM_LINK=your-cal-link
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
ark-builder-labs-site/
├── content/                    # Content management
│   └── blog/                  # MDX blog posts
│       ├── README.md          # Blog writing guide
│       └── *.mdx             # Individual blog posts
├── public/                    # Static assets
│   ├── assets/
│   │   └── images/           # Website images
│   │       └── blog/         # Blog post images
│   └── images/               # General images
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── about/           # About page
│   │   ├── api/             # API routes
│   │   │   └── contact/     # Contact form handler
│   │   ├── blog/            # Blog system
│   │   │   ├── [slug]/      # Dynamic blog post pages
│   │   │   └── page.tsx     # Blog listing page
│   │   ├── contact/         # Contact page
│   │   ├── partnerships/    # Partnerships page
│   │   ├── services/        # Services pages
│   │   │   ├── [service]/   # Dynamic service pages
│   │   │   └── page.tsx     # Services overview
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── providers.tsx    # Theme providers
│   ├── components/
│   │   ├── animations/      # Framer Motion components
│   │   ├── blog/           # Blog-specific components
│   │   ├── calendar/       # Calendar integration
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Navigation, footer, theme
│   │   ├── pages/          # Page-specific components
│   │   ├── sections/       # Homepage sections
│   │   └── ui/             # Base UI components
│   └── lib/
│       ├── blog.ts         # Blog post utilities
│       ├── constants.ts    # Site configuration
│       └── utils.ts        # Utility functions
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables
The following environment variables can be configured in `.env.local`:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://arkbuilderlabs.com
CONTACT_EMAIL=noah@arkbuilderlabs.com

# Calendar Integration
CALCOM_LINK=your-cal-link

# Email Service (for contact form)
# Add your email service configuration here
# SENDGRID_API_KEY=your-sendgrid-key
# MAILGUN_API_KEY=your-mailgun-key
```

### Customization
- **Site Configuration**: Update `src/lib/constants.ts` for company info, services, and navigation
- **Styling**: Modify color scheme in `src/app/globals.css` and Tailwind config
- **Animations**: Customize motion effects in `src/components/animations/`
- **Blog Content**: Add/edit MDX files in `content/blog/` (see content/blog/README.md for guide)

## 📝 Content Management

### Blog System
The site includes a complete MDX-powered blog system:

- **Location**: `content/blog/`
- **Format**: MDX files with frontmatter
- **Features**: Categories, featured posts, dynamic routing, SEO optimization
- **Guide**: See `content/blog/README.md` for detailed writing instructions

### Adding Blog Posts
1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter with required fields (title, excerpt, category, publishedAt)
3. Write content using Markdown/MDX syntax
4. Add images to `public/assets/images/blog/`

## 📱 Integration Setup

### Contact Form
The contact form is ready for email service integration:

1. Choose an email service (SendGrid, Mailgun, AWS SES, etc.)
2. Add service configuration to `src/app/api/contact/route.ts`
3. Set up environment variables for your email service
4. Configure email templates and notifications

### Calendar Integration
Cal.com integration placeholder is available:

1. Sign up for Cal.com
2. Get your booking link
3. Add `CALCOM_LINK` to your `.env.local`
4. Configure booking options and availability

## 🚀 Deployment

### Prerequisites
- GitHub repository with your code
- Environment variables configured
- Production-ready content

### Vercel (Recommended)
1. Push code to GitHub repository
2. Import repository on [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Other Platforms
Compatible with any Next.js hosting platform:
- **Netlify**: Full Next.js support with automatic builds
- **Railway**: Simple deployment with database options
- **DigitalOcean App Platform**: Managed hosting with scaling
- **AWS Amplify**: Full-stack deployment with AWS integration

### Build Verification
Before deploying, ensure your build works locally:
```bash
npm run build
npm start
```

## 📈 Performance

- **Lighthouse Score**: Optimized for 95+ scores
- **Core Web Vitals**: Excellent metrics across all pages
- **Bundle Size**: Optimized with code splitting and lazy loading
- **SEO**: Complete meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or support:
- Email: noah@arkbuilderlabs.com
- Website: [arkbuilderlabs.com](https://arkbuilderlabs.com)
