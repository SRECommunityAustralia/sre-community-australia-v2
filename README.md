# SRE Community Australia

The consolidated website for SRE Community Australia, built with Next.js 14 and deployed on Vercel.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Community homepage with events, resources, sponsors, socials |
| `/survey` | State of SRE ANZ survey (6-step form, Supabase backend) |
| `/report` | Email-gated contributor report with live data visualisations |
| `/resume` | SRE resume writing guide with sticky TOC |
| `/api/verify` | Email verification endpoint for report access |

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (survey submissions, email verification)
- **Data source**: Google Sheets published CSV (live stats)
- **Hosting**: Vercel
- **Design**: Terminal aesthetic (JetBrains Mono, Syne, #39ff8a)

## Getting started

```bash
npm install
npm run dev
```

## Deploying

Push to GitHub and connect the repo to Vercel. Vercel auto-detects Next.js and deploys.
