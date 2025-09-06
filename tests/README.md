# Playwright End-to-End Tests

This directory contains comprehensive end-to-end tests for the Ark Builder Labs website using Playwright.

## Test Structure

- **`smoke.spec.ts`** - Quick smoke tests for basic functionality
- **`homepage.spec.ts`** - Tests for homepage features (hero, stats, CTA buttons)
- **`navigation.spec.ts`** - Tests for navigation, routing, and header functionality
- **`blog.spec.ts`** - Tests for blog system (listing, individual posts, MDX rendering)
- **`contact-form.spec.ts`** - Tests for contact form validation and submission
- **`theme-switching.spec.ts`** - Tests for dark/light theme switching functionality
- **`responsive-design.spec.ts`** - Tests for responsive design across multiple viewports

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Specific Test Files
```bash
npx playwright test tests/smoke.spec.ts
npx playwright test tests/homepage.spec.ts
npx playwright test tests/navigation.spec.ts
```

### UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Coverage

### 🏠 Homepage Tests
- Hero section content and animations
- Weather animations (light/dark themes)
- CTA button functionality
- Stats section display
- Services overview
- Responsive behavior

### 🧭 Navigation Tests
- Desktop and mobile navigation
- Active state indicators
- Theme toggle functionality
- Sticky header behavior
- Cross-page navigation

### 📝 Blog System Tests
- Blog listing page
- Individual blog post rendering
- MDX content parsing
- Navigation between posts
- Metadata and SEO

### 📞 Contact Form Tests
- Form field validation
- Email format validation
- Service dropdown options
- Submission handling
- Rate limiting protection
- Accessibility compliance

### 🎨 Theme Switching Tests
- Dark/light mode toggle
- Theme persistence
- Hero section animation changes
- Cross-page theme consistency
- System preference detection

### 📱 Responsive Design Tests
- Multiple viewport sizes
- Mobile navigation
- Touch interaction targets
- Content overflow prevention
- Image scaling

## Browser Coverage

Tests run on:
- ✅ Desktop Chrome
- ✅ Desktop Firefox  
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome
- ✅ Mobile Safari

## Configuration

See `playwright.config.ts` for:
- Browser configurations
- Viewport settings
- Base URL configuration
- Retry settings
- Report options

## Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running (`npm run dev`)

### Strict Mode Violations
- Use `.first()` or `.nth(0)` for elements that appear multiple times
- Make selectors more specific

### Development Server Issues
- Ensure port 3000 is available
- Check `webServer` configuration in `playwright.config.ts`