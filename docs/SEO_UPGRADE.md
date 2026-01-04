# SEO & Conversion Upgrade - 1on1 Landing Pages

## Summary

Upgraded the 1on1 landing pages for better SEO, conversions, and user experience. All changes use existing components and patterns - no new dependencies.

## 1) Homepage Rebuild (`/app/page.tsx`)

### New Structure
- **Hero Section**: Clear H1 + value prop + dual CTAs (Find a Coach / List Your Gym)
- **How It Works**: 3-step process for Clients, Coaches, and Gym Owners
- **Benefits Cards**: 6 cards highlighting platform advantages
- **Training Categories**: 8 popular categories (Boxing, Strength, Weight Loss, etc.)
- **FAQ Section**: 6 questions with real answers
- **Final CTA**: Sign up + Learn More buttons

### SEO Features
- Proper semantic HTML (one H1, H2s for sections)
- UK-focused copy throughout
- JSON-LD structured data:
  - Organization schema
  - WebSite schema
  - FAQPage schema (matches FAQ section)
- Metadata with OpenGraph
- Canonical URL

## 2) New Dedicated Pages

### `/app/gym-owners/page.tsx`
- Marketing page for gym owners
- Benefits of listing on 1on1
- How it works (4 steps)
- What spaces can be listed
- Strong CTAs to sign up
- Full metadata + OpenGraph

### `/app/how-it-works/page.tsx`
- Explains platform for all 3 roles
- Client flow (4 steps)
- Coach flow (4 steps)
- Gym owner flow (4 steps)
- Token system explanation
- Multiple CTAs for different audiences
- Full metadata + OpenGraph

### `/app/pricing/page.tsx`
- Token system explained
- Typical rate ranges for coaches and gym spaces
- Platform fees (currently free)
- Example scenarios
- Pricing FAQs
- Full metadata + OpenGraph

## 3) Enhanced Existing Pages

### `/app/coaches/page.tsx`
- Added comprehensive metadata
- Updated title: "Find Personal Trainers in the UK"
- SEO-focused description

### `/app/gyms/page.tsx`
- Added comprehensive metadata
- Updated title: "Browse Gym Spaces - Book by the Hour"
- SEO-focused description

### Content Components
Updated intro paragraphs in:
- `components/coaches-content.tsx` - Rich SEO copy about finding trainers
- `components/gyms-content.tsx` - Rich SEO copy about booking spaces

## 4) Structured Data (JSON-LD)

Homepage includes:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "1on1",
      "url": "https://1on1.fitness",
      "logo": "https://1on1.fitness/logo.png"
    },
    {
      "@type": "WebSite",
      "name": "1on1",
      "url": "https://1on1.fitness"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [6 FAQ items]
    }
  ]
}
```

## 5) Sitemap & Robots

### `/app/sitemap.ts`
Generates XML sitemap with:
- Homepage (priority 1.0, daily)
- /coaches (priority 0.9, daily)
- /gyms (priority 0.9, daily)
- /gym-owners (priority 0.8, weekly)
- /how-it-works (priority 0.7, monthly)
- /pricing (priority 0.7, monthly)
- Auth pages (lower priority)

### `/app/robots.ts`
- Allows: Public pages, auth pages
- Disallows: /dashboard/*, /admin/*, /api/*, /onboarding, /account, /messages
- Sitemap reference

## 6) Performance & Best Practices

### Server-Side Rendering
- All new pages are Server Components
- No runtime data access (no cookies/auth on landing pages)
- Fast initial page load

### Semantic HTML
- Proper heading hierarchy (H1 → H2)
- Descriptive link text
- Accessible card structures

### Mobile-First
- Responsive grid layouts
- Touch-friendly buttons
- Readable font sizes

### No Layout Shift
- All components use existing UI library
- No external images (avoiding CLS)
- Consistent spacing

## Metadata Summary

All pages include:
- `title` - UK-focused, keyword-rich
- `description` - Clear value prop, 150-160 chars
- `alternates.canonical` - Prevents duplicate content
- `openGraph` - Social sharing optimization
- `locale: "en_GB"` - UK targeting

## SEO Keywords Targeted

- Personal trainers UK
- Find personal trainer
- Book gym space by the hour
- Hourly gym booking
- Qualified coaches UK
- List your gym
- Fitness marketplace UK
- 1-to-1 training sessions

## Conversion Optimization

### Multiple CTAs
- Hero: Find a Coach / List Your Gym
- Benefits: Specific to each persona
- FAQ: Answers objections
- Final CTA: Sign up / Learn More

### Social Proof Elements
- "Verified coaches"
- "Qualified trainers"
- "UK-wide coverage"
- "Free to list"

### Clear Value Props
- For Clients: Find qualified trainers
- For Coaches: Grow business + book spaces
- For Gym Owners: Earn from unused hours

## Testing Checklist

- [ ] Homepage loads without runtime warnings
- [ ] All metadata appears in page source
- [ ] JSON-LD validates at schema.org validator
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt
- [ ] All CTAs link to correct pages
- [ ] Mobile responsive on all new pages
- [ ] No console errors on any page
- [ ] OpenGraph tags appear when sharing links

## Future Enhancements

- Add actual logo image for Organization schema
- Add SearchAction to WebSite schema when search implemented
- Add BreadcrumbList schema to detail pages
- Add LocalBusiness schema for gym listings
- Add Person schema for coach profiles
- Add review/rating aggregates when available

