# VivaAI Astrology — Production SaaS Implementation Plan

## Overview

Build a production-ready AI Astrology SaaS platform for **vivaai.in**, inspired by AstroSage/AstroTalk/Clickastro. The existing workspace at `d:\MERN Projects\Astro` contains a working static Vedic Kundali generator with solid calculation logic (Lahiri ayanamsa, sidereal longitudes, Vimshottari dasha, nakshatra). We'll migrate this into a full Next.js 15 SaaS app.

> [!IMPORTANT]
> This is a **massive project** (~200+ files). We'll build it in **5 phases**, each deployable independently. Phase 1 alone is a functional MVP that can start earning.

## User Review Required

> [!WARNING]
> **Breaking Change**: The existing static HTML/CSS/JS files will be replaced by a Next.js 15 project. Your existing astrology calculation logic in `script.js` will be preserved and migrated into TypeScript modules.

> [!IMPORTANT]
> **API Keys Needed Before Phase 2+**:
> - OpenAI API key (for AI features)
> - Razorpay Key ID + Secret (for payments)
> - Neon/Supabase PostgreSQL connection string
> - Google OAuth credentials (for auth)
> - Upstash Redis URL + Token (for caching)

## Open Questions

1. **Database Provider**: Do you prefer **Neon** or **Supabase** for PostgreSQL? (Neon recommended for Vercel)
2. **Auth Provider**: NextAuth/Auth.js or **Clerk**? (Your prompt mentions both — Clerk is simpler but paid at scale)
3. **Domain**: Confirm using `vivaai.in` or do you want to register a new astrology-specific domain?
4. **OpenAI Model**: GPT-4o-mini (cheaper, good for volume) or GPT-4o (better quality, higher cost)?
5. **Initial Language**: Start with English-only or English + Hindi from day one?

---

## Phase 1: Foundation + MVP (Current Sprint)
*Goal: Deployable app with free Kundali, homepage, auth, basic SEO — enough for AdSense application*

### Project Setup

#### [NEW] Initialize Next.js 15 Project
- `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Install: `shadcn/ui`, `framer-motion`, `zustand`, `@tanstack/react-query`, `prisma`, `@prisma/client`
- Configure TailwindCSS with cosmic dark theme + gold accents design system
- Setup shadcn/ui with custom astrology theme

#### [NEW] `src/styles/globals.css`
- Design system: CSS variables for cosmic gradients, gold accents, glassmorphism
- Dark cosmic theme matching existing `style.css` aesthetic
- Responsive breakpoints, typography (Google Fonts: Sora + Inter)

#### [NEW] `.env.example`
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=https://vivaai.in
```

---

### Database Schema

#### [NEW] `prisma/schema.prisma`
Core models: `User`, `Profile` (birth details), `KundaliReport`, `Subscription`, `Payment`, `BlogPost`, `Coupon`, `SupportTicket`, `AIChatSession`, `AIChatMessage`

---

### Core Astrology Engine (Migrated from existing code)

#### [NEW] `src/lib/astrology/constants.ts`
- Rashi, Nakshatra, Dasha lord arrays migrated from `script.js`

#### [NEW] `src/lib/astrology/calculations.ts`
- `lahiriAyanamsa()`, `getRashiInfo()`, `getNakshatraInfo()`, `calcAscendant()`
- `planetarySiderealLongitudes()`, `getVimshottariSummary()`
- All migrated from existing `script.js` to typed TypeScript

#### [NEW] `src/lib/astrology/interpretations.ts`
- `describeTemperament()`, `getPositivesAndChallenges()`, `estimateMarriageWindow()`
- `buildLifeTimeline()`, `buildRemedies()` — migrated + enhanced

#### [NEW] `src/lib/astrology/geocoding.ts`
- Place geocoding + timezone conversion (from existing code)

---

### Homepage

#### [NEW] `src/app/page.tsx`
Premium homepage with sections:
- Hero with animated stars background + "Generate Free Kundali" CTA
- Zodiac carousel
- Feature highlights (AI Astrologer, Kundali, Matching)
- Testimonials
- Premium plans preview
- Blog preview
- FAQ accordion
- Footer with SEO links

#### [NEW] `src/components/home/HeroSection.tsx`
- Cosmic gradient background, gold accents, glassmorphism cards
- Animated star particles (canvas-based, lightweight)
- CTA buttons with glow effects

#### [NEW] `src/components/home/ZodiacSection.tsx`
- 12 zodiac sign cards with hover animations
- Links to `/horoscope/[sign]/today`

#### [NEW] `src/components/home/PricingSection.tsx`
- Free vs Premium comparison table
- Monthly/Yearly toggle

#### [NEW] `src/components/home/TestimonialsSection.tsx`
#### [NEW] `src/components/home/FAQSection.tsx`
#### [NEW] `src/components/home/FooterSection.tsx`

---

### Kundali Generator Page

#### [NEW] `src/app/kundali/page.tsx`
- Birth details form (migrated + enhanced from existing)
- Real-time validation
- Place autocomplete

#### [NEW] `src/app/kundali/[id]/page.tsx`
- Full kundali report display
- Free users: 30% visible, rest blurred with premium unlock CTA
- Premium users: full report
- Share + Download buttons

#### [NEW] `src/components/kundali/BirthChart.tsx`
- Visual North Indian chart (SVG-based)
- Planet positions rendered accurately

#### [NEW] `src/components/kundali/ReportSections.tsx`
- Modular sections: Core factors, Graha positions, Personality, Dasha timeline, etc.

---

### Layout & Navigation

#### [NEW] `src/app/layout.tsx`
- Root layout with metadata, fonts, providers
- SEO meta tags, OG image defaults

#### [NEW] `src/components/layout/Navbar.tsx`
- Responsive navbar with mobile menu
- Auth state awareness (Login/Dashboard)
- Glassmorphism style

#### [NEW] `src/components/layout/Footer.tsx`
- SEO-optimized footer with sitemap links

#### [NEW] `src/components/ui/StarBackground.tsx`
- Animated cosmic particle background (canvas)

---

### Legal Pages (Required for AdSense)

#### [NEW] `src/app/about/page.tsx`
#### [NEW] `src/app/privacy/page.tsx`
#### [NEW] `src/app/terms/page.tsx`
#### [NEW] `src/app/disclaimer/page.tsx`
#### [NEW] `src/app/contact/page.tsx`
#### [NEW] `src/app/refund-policy/page.tsx`

---

### Basic SEO

#### [NEW] `src/app/sitemap.ts` — Dynamic sitemap generation
#### [NEW] `src/app/robots.ts` — Robots.txt
#### [NEW] `src/lib/seo/metadata.ts` — Reusable metadata helpers

---

## Phase 2: Auth + Payments + AI Chat
*Goal: User accounts, premium subscriptions, AI astrologer chat*

### Authentication (Auth.js / NextAuth)
- Google OAuth login
- Email OTP login (via Resend)
- Guest mode with limited access
- Session management + middleware

### Razorpay Integration
- Subscription plans (Free, Premium Monthly ₹99, Yearly ₹999)
- One-time report purchases (₹199-₹999)
- Webhook handler for payment verification
- Coupon system

### AI Astrologer Chat
- OpenAI GPT-4o integration
- Context-aware (uses user's kundali data)
- Streaming responses
- Daily limit for free users, unlimited for premium
- Chat history persistence

---

## Phase 3: Horoscopes + Matching + SEO Pages
*Goal: High-traffic SEO pages, kundali matching, programmatic SEO*

### Horoscope System
- `/horoscope/[sign]/today|weekly|monthly|yearly`
- 12 signs × 4 timeframes = 48 pages (ISR)
- AI-generated daily content via cron
- SEO-optimized metadata per page

### Kundali Matching
- Ashtakoot matching algorithm
- Guna score calculation
- Manglik compatibility
- AI relationship analysis
- Premium detailed report

### Programmatic SEO Pages (500+)
- `/nakshatra/[name]` — 27 pages
- `/zodiac/[sign]` — 12 detailed pages
- `/dosha/[type]` — Manglik, Sade Sati, etc.
- `/gemstone/[stone]` — Gemstone recommendations
- `/calculator/[type]` — Moon sign, ascendant, numerology calculators
- Festival landing pages

---

## Phase 4: Premium Reports + PDF + Blog CMS
*Goal: Monetization engine — paid reports, blog for SEO traffic*

### PDF Report Engine
- React-PDF or Puppeteer-based generation
- Premium-branded templates with gold theme
- 20-40 page detailed reports
- Career, Marriage, Finance, Health, etc.

### Blog CMS
- Markdown-based blog with admin editor
- Categories, tags, related posts
- AI-assisted article generation
- OG image auto-generation
- Internal linking structure

### Remedies Module
- AI-personalized gemstone, mantra, fasting suggestions
- Based on user's kundali

---

## Phase 5: Admin Dashboard + Growth Features
*Goal: Operations management + viral growth*

### Admin Dashboard
- User management
- Subscription analytics
- Report generation stats
- Blog post management
- Coupon management
- Revenue analytics

### Growth & Monetization
- AdSense integration with lazy-loaded placements
- Exit intent popup for premium upsell
- WhatsApp sharing
- Push notifications
- Referral system
- Email marketing hooks

---

## Folder Structure (Final)

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (marketing)/          # Homepage, about, legal pages
│   ├── admin/                # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── kundali/
│   │   ├── horoscope/
│   │   ├── chat/
│   │   ├── payment/
│   │   └── webhook/
│   ├── blog/
│   ├── chat/                 # AI chat
│   ├── horoscope/[sign]/[period]/
│   ├── kundali/
│   ├── matching/
│   ├── reports/
│   └── layout.tsx
├── components/
│   ├── home/
│   ├── kundali/
│   ├── chat/
│   ├── layout/
│   ├── shared/
│   └── ui/                   # shadcn components
├── lib/
│   ├── astrology/            # Core calculation engine
│   ├── ai/                   # OpenAI integration
│   ├── auth/                 # Auth helpers
│   ├── db/                   # Prisma client
│   ├── payment/              # Razorpay helpers
│   ├── pdf/                  # PDF generation
│   ├── seo/                  # SEO utilities
│   └── utils/
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand stores
└── types/                    # TypeScript types
```

---

## Verification Plan

### Automated Tests
- `npm run build` — Ensure zero build errors
- `npm run lint` — Clean linting
- Browser testing of homepage, kundali generator, and chart rendering
- Astrology calculation unit tests (verify against known birth charts)

### Manual Verification
- Visual inspection of all pages on mobile + desktop
- Kundali generation end-to-end test
- Payment flow test in Razorpay sandbox
- SEO audit with Lighthouse
- Core Web Vitals check

### Deployment
- Push to GitHub
- Connect to Vercel
- Add environment variables
- Configure DNS for vivaai.in
- Verify production build
