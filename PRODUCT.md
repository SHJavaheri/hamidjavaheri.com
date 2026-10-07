# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: Astro + TypeScript, Tailwind CSS, GSAP (ScrollTrigger) for scroll-driven motion. Chosen because it ships near-zero JS by default (fast, SEO-friendly static output) while allowing rich islands of interaction, and matches the stack Hamid already uses (TS, Tailwind, GSAP). Deployed on Vercel (Hobby). No GitHub Actions deploys.

## Users

- **Primary:** people who hear Hamid's name or find him online — peers, founders, potential collaborators, people in tech and design — who want to understand who he is and what he has built. They arrive curious, usually from a link (LinkedIn, GitHub, hublii.com, word of mouth), on desktop or phone.
- **Secondary:** people who might want to build something with him. The site must signal he is open to interesting collaborations **subtly**, never as a "hire me" / services / rates page (his employer restricts second income).

## Product Purpose

A personal podium: a visual résumé that shows what Hamid has made, what he is making now, and where he is going. Success = a visitor leaves remembering him as an inventive builder whose ideas come to life, knows Hublii is his flagship (and joins/visits its waitlist), and knows how to reach him.

## Positioning

Hamid is an "inventor" — since childhood he wanted his ideas to come to life. Software is where that started; the goal is to grow into someone who can build anything, for anyone in need, and be recognized as innovative and creative. He designs, architects, and ships products by directing AI engineering agents — owned proudly, never framed as "I did it all alone".

## Operating Context

- Day job: Software Engineer — Application Developer, Integration Team, CIBC. Computer Engineering, Toronto Metropolitan University (formerly Ryerson), class of 2025. Based in the Toronto area (EDT/EST).
- Not job hunting. No résumé shown or linked — the site itself is the résumé.

## Capabilities and Constraints

- Sections: hero/intro, a **podium** of projects (#1 = proudest), a **currently working on** section, about/story, goals, skills/stack, contact.
- Must keep: ambient background music (muted until first interaction, toggleable), light/dark theme toggle where **dark mode turns the cursor into a flashlight** (radial light follows the pointer) — keep and improve. Hidden scrollbar (scrolling still works). Scroll-driven animations.
- Removed: the reviews page.
- The existing CNAME/custom domain hamidjavaheri.com moves to Vercel; `hamidjavaheri.com/MasHoorCake/` should keep working via rewrite to shjavaheri.github.io/MasHoorCake/.
- Must respect prefers-reduced-motion and keyboard/touch users (flashlight needs a non-pointer fallback).

## Brand Commitments

- Name: Hamid Javaheri. Keep the existing profile photo (`images/homepage/profile_pic.jpg`).
- Links: LinkedIn https://www.linkedin.com/in/hamidjavaheri/, GitHub https://github.com/SHJavaheri, email seyedhamidjavaheri@gmail.com.
- Tone: warm, proud, curious, a little playful; easy on the eyes, uncluttered.

## Evidence on Hand

Featured projects (repos are read-only sources; private repos are never linked):
1. **hublii** — flagship, #1, currently building. Calm client portal / project hub for service businesses and their clients. Link https://hublii.com — live waitlist, not launched yet. Next.js 16, React 19, TS strict, AWS (Aurora Serverless v2, Cognito, S3+GuardDuty, CDK), Vercel; ~162K LOC TS, 228 test files (Vitest, Playwright, axe), CI, runbook + restore drills; 1,199 commits Sep 20–Oct 5 2026. Brand: lowercase "hublii", Nunito ExtraBold, Tidy Stack logo, Yumi the otter mascot (drawn by Hamid), day/evening/golden themes. Assets: repo `design/logos/`, `apps/web/public/yumi/`, `apps/web/public/waitlist/`, screenshots in `docs/agents/screens/`. Must be detailed.
2. **FirstLine** (Project-F) — "Find the right professional. The first time." Directory + social network for lawyers, accountants, agents, contractors; reviews, real-time messaging, feed, push; web (Next.js 16, Supabase, Vercel) + native app (Expo). ~34K LOC web + ~22K mobile. Not live (no link). Brand blue #2563EB / cyan #06B6D4.
3. **Bethesda Labradors** — family Labrador breeder marketing site (Next.js, GSAP). Present as a finished case study with screenshots; do NOT link.
4. **Pawmetric** — puppy activity tracker mobile app (Expo, SQLite, insights, wellness score). In progress.
5. **MasHoorCake** — bilingual (EN/Persian, RTL) custom-cake bakery site with interactive SVG Cake Maker and PDF/WhatsApp request. Present as finished case study with screenshots; do NOT link.
- No testimonials, client quotes, user counts, or outcomes exist — never fabricate them. Hublii has no paying users yet.
- Screenshots of FirstLine, Pawmetric, Bethesda, MasHoorCake must be captured (none committed); never show internal docs, AWS IDs, draft banners, or personal pet logs.

## Product Principles

1. The work leads — projects are the hero, the interface recedes.
2. Ideas coming to life: every section should feel like something being invented, built, switched on.
3. Proud, not boastful — credit the process honestly (AI agents, collaborators), celebrate the outcome.
4. Calm over clutter — rich motion, but easy on the eyes.
5. Open door, quietly — collaboration is welcome, never sold.

## Accessibility & Inclusion

WCAG 2.1 AA. Reduced-motion alternative for all scroll-driven and flashlight effects; audio never autoplays unmuted; full keyboard navigation.
