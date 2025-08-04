# Ark Builder Labs Website

A modern, professional company website built with Next.js 15, featuring bold animations, dark mode support, and comprehensive business pages.

## 🚀 Features

- **Modern Design System**: Professional UI with gradient themes and smooth animations
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach ensuring great UX across all devices
- **Animation Library**: Smooth page transitions and micro-interactions using Framer Motion
- **SEO Optimized**: Meta tags, structured data, and performance optimizations
- **Contact Integration**: Working contact forms with API routes (ready for email service integration)
- **Service Pages**: Dynamic routing for individual service offerings
- **Blog System**: Ready-to-use blog layout with MDX support structure
- **Partnership Showcase**: Professional certifications and technology partner displays

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Theme**: next-themes
- **UI Components**: Custom component library with CVA (Class Variance Authority)

## 📋 Pages Included

- **Homepage**: Hero section, services overview, stats, and CTA
- **About**: Company story, mission, values, and approach
- **Services**: Main services page with detailed individual service pages
  - Web & Mobile Development
  - Cloud Engineering & Consulting
  - AI Technology Consulting
- **Partnerships**: Technology partners and professional certifications
- **Blog**: Article listing with placeholder content structure
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

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── about/          # About page
│   ├── api/            # API routes
│   ├── blog/           # Blog pages
│   ├── contact/        # Contact pages
│   ├── partnerships/   # Partnerships page
│   └── services/       # Services pages
├── components/
│   ├── animations/     # Reusable animation components
│   ├── forms/          # Form components
│   ├── layout/         # Navigation, footer, theme toggle
│   ├── pages/          # Page-specific components
│   ├── sections/       # Homepage sections
│   └── ui/             # Base UI components
└── lib/
    ├── constants.ts    # Site configuration and data
    └── utils.ts        # Utility functions
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_SITE_URL=https://arkbuilderlabs.com
CONTACT_EMAIL=noah@arkbuilderlabs.com
CALCOM_LINK=your-cal-link
```

### Customization
- Update site configuration in `src/lib/constants.ts`
- Modify color scheme in `src/app/globals.css`
- Customize animations in `src/components/animations/`

## 📱 Contact Form Integration

The contact form is ready for email service integration. To make it functional:

1. Choose an email service (SendGrid, Mailgun, AWS SES, etc.)
2. Add your service configuration to `src/app/api/contact/route.ts`
3. Set up environment variables for your email service
4. Configure email templates and notifications

## 🎯 Calendar Integration

The contact page includes a placeholder for Cal.com integration:

1. Sign up for Cal.com
2. Get your booking link
3. Replace the placeholder in `src/app/contact/page.tsx`
4. Configure booking options and availability

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically

### Other Platforms
The site can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

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
