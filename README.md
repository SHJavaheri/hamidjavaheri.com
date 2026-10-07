# hamidjavaheri.com

Hamid Javaheri's personal site, presented as a product launch keynote: chapters for each project, a podium, and hublii as the finale.

## Stack

- [Astro 7](https://astro.build) + TypeScript (static output)
- GSAP + ScrollTrigger for the scroll-driven chapters
- Self-hosted Archivo, JetBrains Mono and Nunito via Fontsource
- Hosted on Vercel

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build to dist/
npm run preview  # serve the build
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/site.ts` | All copy and project facts |
| `src/data/shots.ts` | Screenshot reels |
| `src/components/chapters/` | One component per chapter of the show |
| `src/scripts/show.ts` | Scroll choreography, chapter counter, stage gels |
| `src/scripts/spotlight.ts` | Dark-mode follow-spot |
| `src/scripts/controls.ts` | House lights (theme) and the ambient score (audio) |
| `src/lib/iso.ts` | Tiny isometric engine for the exploded diagrams |
| `public/projects/` | Project screenshots and brand assets |
