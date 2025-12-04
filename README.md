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
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss` with design tokens defined using `@theme inline` in `src/app/globals.css`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Theme**: next-themes
- **UI Components**: Custom component library with CVA (Class Variance Authority)
- **Blog**: MDX content (frontmatter via `gray-matter`, rendered with `next-mdx-remote/rsc`); MD/MDX page support enabled via `@next/mdx`
- **Content Management**: File-based MDX content system

## 📋 Pages & Features

- **Homepage**: Hero section, services overview, stats, and CTA
- **About**: Company story, mission, values, and approach
- **Services**: Main services page with detailed individual service pages
  - Web & Mobile Development
  - Cloud Engineering & Consulting
  - AI Technology Consulting
- **Partnerships**: Placeholder folder present (page not yet implemented)
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
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # General
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   CONTACT_EMAIL=your-email@example.com
   CALCOM_LINK=your-cal-link

   # Formspree for contact form
   NEXT_PUBLIC_USE_FORMSPREE=true
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
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
- `npm test` - Run unit tests (Jest)
- `npm run test:watch` - Watch mode for unit tests
- `npm run test:coverage` - Unit test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright with UI test runner
- `npm run test:e2e:headed` - Run Playwright tests in headed browsers
- `npm run test:e2e:report` - Open the last Playwright HTML report

### Testing

- **Unit tests (Jest)**: Tests live under `src/__tests__/`. Jest is configured via `jest.config.js` (wrapping `next/jest`) with setup in `jest.setup.js` (mocks router, animations, IntersectionObserver, matchMedia, and global fetch). Example: `npx jest src/__tests__/components/blog-content.test.tsx`.
- **E2E (Playwright)**: Tests live under `tests/`. `playwright.config.ts` starts the dev server (`npm run dev`), uses baseURL `http://localhost:3000`, and reuses an existing server locally. Run: `npm run test:e2e`.

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
├── jest.config.js          # Jest configuration (wraps next/jest)
├── jest.setup.js           # Jest setup and mocks
├── playwright.config.ts    # Playwright configuration
├── postcss.config.mjs      # PostCSS configuration (uses @tailwindcss/postcss for Tailwind v4)
├── tests/                  # Playwright end-to-end tests
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables
The following environment variables can be configured in `.env.local`:

```env
# Contact Form / Formspree
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
# Optional: server-side deploy key for authenticated submissions
FORMSPREE_DEPLOY_KEY=your-formspree-deploy-key
```

Notes:
- The contact API validates input with Zod, applies basic rate limiting, logs only a 100‑char message preview for privacy, and simulates ~1s processing delay.
- Variables such as `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL`, `CALCOM_LINK`, and `NEXT_PUBLIC_USE_FORMSPREE` are not currently used by the code.

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
Server-side submission to Formspree is already implemented in `src/app/api/contact/route.ts`.

1. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` (required)
2. Optionally set `FORMSPREE_DEPLOY_KEY` for authenticated submissions
3. The API validates input with Zod, rate-limits requests, logs only the first 100 chars of the message, and includes a ~1s simulated delay
4. You can add a fallback email service (e.g., SES/SendGrid) where marked in the route if Formspree returns a 5xx

### Calendar Integration
Cal.com embed is set up in `src/components/calendar/consultation-calendar.tsx`.

1. Sign up for Cal.com
2. Get your booking link
3. Update the `calLink` prop in `ConsultationCalendar` (currently `"noahjenkins/consultation"`)
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

## 🙋‍♂️ Support

For questions or support:
- Email: contact@arkbuilderlabs.com
- Website: [arkbuilderlabs.com](https://arkbuilderlabs.com)
